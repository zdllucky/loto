import { graphql } from "@keystone-6/core";
import { Extension } from "../../_misc/types";
import { Context } from ".keystone/types";

const joinRoomMutation: Extension = () => {
  const JoinRoomFailure = graphql.object<{ message: string }>()({
    name: "JoinRoomFailure",
    fields: {
      message: graphql.field({
        type: graphql.nonNull(graphql.String),
      }),
    },
  });
  const JoinRoomSuccess = graphql.object<{ roomId: string }>()({
    name: "JoinRoomSuccess",
    fields: {
      roomId: graphql.field({ type: graphql.nonNull(graphql.ID) }),
    },
  });

  return graphql.field({
    type: graphql.union({
      types: [JoinRoomSuccess, JoinRoomFailure],
      name: "joinRoomResult",
    }),
    args: {
      roomId: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
    },
    resolve: async (rootVal, { roomId }, context: Context) => {
      const sCtx = context.sudo();

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        include: { ownedRoom: { select: { id: true } } },
      });

      if (!user)
        return {
          __typename: "JoinRoomFailure",
          message: "User not found",
        };

      if (user.gameId)
        return {
          __typename: "JoinRoomFailure",
          message: "User already in game",
        };

      if (user.ownedRoom?.id)
        await context.graphql.run({
          query: `mutation { exitRoom { __typename } }`,
        });

      const room = await sCtx.prisma.room.findUnique({
        where: { id: roomId },
        include: {
          users: { select: { id: true } },
          bots: { select: { id: true } },
        },
      });

      if (!room)
        return {
          __typename: "JoinRoomFailure",
          message: "Room not found",
        };

      if (room.type === "private")
        return {
          __typename: "JoinRoomFailure",
          message: "Room is private",
        };

      if (room.users.length + room.bots.length >= 5)
        return {
          __typename: "JoinRoomFailure",
          message: "Room is full",
        };

      const res = await sCtx.prisma.user.update({
        where: { id: user.id },
        data: { room: { connect: { id: roomId } } },
        select: { roomId: true },
      });

      if (!res.roomId)
        return {
          __typename: "JoinRoomFailure",
          message: "Failed to join room",
        };

      return { __typename: "JoinRoomSuccess", roomId };
    },
  });
};

export default joinRoomMutation;
