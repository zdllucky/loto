import { graphql } from "@keystone-6/core";
import { Extension } from "../../_misc/types";

const joinPrivateRoomMutation: Extension = () => {
  const JoinPrivateRoomResult = graphql.object<{
    success: boolean;
    message: string | undefined;
  }>()({
    name: "JoinPrivateRoomResult",
    fields: {
      success: graphql.field({ type: graphql.nonNull(graphql.Boolean) }),
      message: graphql.field({ type: graphql.String }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(JoinPrivateRoomResult),
    args: {
      roomId: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
      password: graphql.arg({ type: graphql.nonNull(graphql.String) }),
    },
    resolve: async (rootVal, { roomId, password }, context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return { success: false, message: "server.unauthorized" };

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          id: true,
          ownedRoom: true,
          gameId: true,
        },
      });

      if (!user) return { success: false, message: "server.userNotFound" };

      if (user.gameId)
        return { success: false, message: "server.game.userAlreadyInGame" };

      const room = await sCtx.prisma.room.findUnique({
        where: { id: roomId },
        select: {
          users: { select: { id: true } },
          type: true,
          password: true,
        },
      });

      if (!room) return { success: false, message: "server.room.notFound" };

      if (room.type !== "private")
        return { success: false, message: "server.room.notPrivate" };

      if (room.password !== password)
        return { success: false, message: "server.room.wrongPassword" };

      if (room.users.length >= 5)
        return { success: false, message: "server.room.full" };

      if (room.users.find((u) => u.id === userId))
        return { success: false, message: "server.room.alreadyInRoom" };

      if (user.ownedRoom?.id)
        await context.graphql.run({
          query: `mutation { exitRoom { __typename } }`,
        });

      // TODO: Implement user exit check

      await sCtx.prisma.room.update({
        where: { id: roomId },
        data: {
          users: { connect: { id: userId } },
        },
      });

      return { success: true, message: "server.room.joined" };
    },
  });
};

export default joinPrivateRoomMutation;
