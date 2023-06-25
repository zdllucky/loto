import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

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
    resolve: async (rootVal, _, context: Context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId)
        return { __typename: "ExitRoomFailure", message: "Unauthorized" };

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
        return { __typename: "ExitRoomFailure", message: "User not found" };

      if (!user.room)
        return {
          __typename: "ExitRoomFailure",
          message: "User is not in a room",
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
          message: e?.message ?? "Undefined error",
        };
      }

      return { __typename: "ExitRoomSuccess", ok: true };
    },
  });
};

export default exitRoomMutation;
