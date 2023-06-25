import { graphql } from "@keystone-6/core";
import { Extension } from "../../_misc/types";
import { Context } from ".keystone/types";
import { connection, Queues } from "../../../brokers/consts";
import { Queue } from "bullmq";

const startGameMutation: Extension = () => {
  const StartPrivateGameResult = graphql.object<{
    success: boolean;
    message: string | undefined;
  }>()({
    name: "StartPrivateGameResult",
    fields: {
      success: graphql.field({ type: graphql.nonNull(graphql.Boolean) }),
      message: graphql.field({ type: graphql.String }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(StartPrivateGameResult),
    resolve: async (rootVal, _, context: Context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return { success: false, message: "Unauthorized" };

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

      if (!user) return { success: false, message: "User not found" };

      if (!user.ownedRoom)
        return { success: false, message: "User is not in a room" };

      if (user.ownedRoom.users.length < 2)
        return { success: false, message: "Room has not got enough users." };

      if (user.ownedRoom.users.length > 5)
        return { success: false, message: "Room has too many users" };

      const createGameProcedureQueue = new Queue(
        Queues.createGameProcedure.name,
        { connection }
      );

      await createGameProcedureQueue.add("createPrivateGameProcedure", {
        roomId: user.ownedRoom.id,
      });

      return {
        success: true,
        message: `Game create event sent`,
        roomId: user.ownedRoom.id,
      };
    },
  });
};

export default startGameMutation;
