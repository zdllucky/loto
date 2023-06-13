import { graphql, list } from "@keystone-6/core";
import { relationship, select, timestamp } from "@keystone-6/core/fields";
import { allowAll, denyAll } from "@keystone-6/core/access";
import { hasSession, isAdminOrOnlySameUserFilter } from "./misc/accessHelpers";
import { ExportedExtension } from "./misc/types";
import { Context } from ".keystone/types";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: denyAll,
      delete: denyAll,
    },
    filter: {
      query: isAdminOrOnlySameUserFilter,
    },
  },
  fields: {
    speed: select({
      type: "integer",
      options: [
        { label: "Easy", value: 2 },
        { label: "Common", value: 3 },
        { label: "Hard", value: 4 },
      ],
    }),
    bots: relationship({ ref: "Bot.room", many: true }),
    users: relationship({ ref: "User.room", many: true }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      access: {
        create: denyAll,
        update: denyAll,
        read: allowAll,
      },
    }),
  },
  ui: {
    hideCreate: true,
    listView: { defaultFieldMode: "read" },
    hideDelete: true,
    createView: { defaultFieldMode: "hidden" },
    itemView: { defaultFieldMode: "read" },
  },
  graphql: {
    omit: { create: true, update: true, delete: true },
  },
});

const extension: ExportedExtension = {
  mutation: {
    joinRoom: (schema) => {
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

            if (typeof transactionRes === "string")
              throw new Error(transactionRes);
          } catch (e: any) {
            return {
              __typename: "JoinRoomFailure",
              message: e.message ?? "UnknownError",
            };
          }

          return { __typename: "JoinRoomSuccess", roomId };
        },
      });
    },
  },
};

export default {
  schema,
  extension,
};
