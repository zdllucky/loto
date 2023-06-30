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

      if (!userId) return { success: false, message: "Unauthorized" };

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          id: true,
          ownedRoom: true,
          gameId: true,
        },
      });

      if (!user) return { success: false, message: "User not found" };

      if (user.gameId)
        return { success: false, message: "User is already in a game" };

      const room = await sCtx.prisma.room.findUnique({
        where: { id: roomId },
        select: {
          users: { select: { id: true } },
          type: true,
          password: true,
        },
      });

      if (!room) return { success: false, message: "Room not found" };

      if (room.type !== "private")
        return { success: false, message: "Room is not private" };

      if (room.password !== password)
        return { success: false, message: "Wrong password" };

      if (room.users.length >= 5)
        return { success: false, message: "Room is full" };

      if (room.users.find((u) => u.id === userId))
        return { success: false, message: "User is already in the room" };

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

      return { success: true, message: "Joined successfully" };
    },
  });
};

export default joinPrivateRoomMutation;
