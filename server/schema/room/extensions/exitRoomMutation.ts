import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";

const exitRoomMutation: Extension = () => {
  const ExitRoomFailure = graphql.object<{ message: string }>()({
    name: "ExitRoomFailure",
    fields: {
      message: graphql.field({
        type: graphql.nonNull(graphql.String),
      }),
    },
  });
  const ExitRoomSuccess = graphql.object<{ ok: true }>()({
    name: "ExitRoomSuccess",
    fields: {
      ok: graphql.field({ type: graphql.Boolean }),
    },
  });

  return graphql.field({
    type: graphql.union({
      types: [ExitRoomSuccess, ExitRoomFailure],
      name: "ExitRoomResult",
    }),
    args: {},
    resolve: async (rootVal, _, context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId)
        return {
          __typename: "ExitRoomFailure",
          message: "server.unauthorized",
        };

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          id: true,
          room: {
            select: {
              id: true,
              users: { select: { id: true } },
              ownerId: true,
            },
          },
        },
      });

      if (!user)
        return {
          __typename: "ExitRoomFailure",
          message: "server.userNotFound",
        };

      if (!user.room)
        return {
          __typename: "ExitRoomFailure",
          message: "server.room.notInRoom",
        };

      try {
        if (user.room.users.length === 1)
          await sCtx.prisma.room.delete({ where: { id: user.room.id } });
        else
          await sCtx.prisma.room.update({
            where: { id: user.room.id },
            data: {
              users: { disconnect: { id: userId } },
              ...{
                ownerId:
                  user.room.ownerId === userId
                    ? user.room.users.find(({ id }) => id !== userId)?.id
                    : user.room.ownerId,
              },
            },
          });
      } catch (e: any) {
        return {
          __typename: "ExitRoomFailure",
          message: e?.message ?? "server.room.failedToExit",
        };
      }

      return { __typename: "ExitRoomSuccess", ok: true };
    },
  });
};

export default exitRoomMutation;
