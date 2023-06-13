import { graphql } from "@keystone-6/core";
import { Extension } from "../../misc/types";
import { Context } from ".keystone/types";

const joinRoomMutation: Extension = (schema) => {
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

      const user = await sCtx.db.User.findOne({
        where: { id: context.session?.itemId },
      });

      if (!user)
        return {
          __typename: "JoinRoomFailure",
          message: "User not found",
        };

      try {
        const transactionRes = await sCtx.prisma.$transaction<
          string | undefined
        >(async (prisma) => {
          try {
            const [{ total }] = await prisma.$queryRaw<[{ total: number }]>`
                  SELECT COUNT(*) AS total
                  FROM (SELECT room
                        FROM "Bot"
                        WHERE room = ${roomId}
                        UNION ALL
                        SELECT room
                        FROM "User"
                        WHERE room = ${roomId}) AS unioned
                  GROUP BY room`;

            if (total >= 5) throw new Error("Room is full");

            await prisma.$executeRaw`UPDATE "User"
                                       SET room = ${roomId}
                                       WHERE id = ${user.id}`;
          } catch (e: any) {
            console.log(e);
            return e.message ?? "UnknownError";
          }

          return undefined;
        });

        if (typeof transactionRes === "string") throw new Error(transactionRes);
      } catch (e: any) {
        return {
          __typename: "JoinRoomFailure",
          message: e.message ?? "UnknownError",
        };
      }

      return { __typename: "JoinRoomSuccess", roomId };
    },
  });
};

export default joinRoomMutation;
