import { Extension } from "../../misc/types";
import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

const exitRoomMutation: Extension = (schema) => {
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

      const user = await sCtx.db.User.findOne({
        where: { id: context.session?.itemId },
      });

      if (!user)
        return { __typename: "ExitRoomFailure", message: "User not found" };

      try {
        await sCtx.db.User.updateOne({
          where: { id: user.id },
          data: { room: { disconnect: true } },
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
