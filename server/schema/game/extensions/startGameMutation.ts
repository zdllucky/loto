import { graphql } from "@keystone-6/core";
import { Extension } from "../../_misc/types";
import { connection, Queues } from "../../../brokers/consts";
import { Queue } from "bullmq";

const startGameMutation: Extension = () => {
  const StartGameResult = graphql.object<{
    success: boolean;
    message: string | undefined;
  }>()({
    name: "StartGameResult",
    fields: {
      success: graphql.field({ type: graphql.nonNull(graphql.Boolean) }),
      message: graphql.field({ type: graphql.String }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(StartGameResult),
    resolve: async (rootVal, _, context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return { success: false, message: "server.unauthorized" };

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          id: true,
          ownedRoom: {
            select: {
              id: true,
              type: true,
              users: { select: { id: true } },
            },
          },
        },
      });

      if (!user) return { success: false, message: "server.userNotFound" };

      if (!user.ownedRoom)
        return { success: false, message: "server.room.notFound" };

      if (user.ownedRoom.users.length < 2)
        return { success: false, message: "server.room.tooFewUsers" };

      if (user.ownedRoom.users.length > 5)
        return { success: false, message: "server.room.tooManyUsers" };

      const createGameProcedureQueue = new Queue(
        Queues.createGameProcedure.name,
        { connection }
      );

      await createGameProcedureQueue.add("createPrivateGameProcedure", {
        roomId: user.ownedRoom.id,
      });

      return {
        success: true,
        message: `server.game.startRequestSent`,
        roomId: user.ownedRoom.id,
      };
    },
  });
};

export default startGameMutation;
