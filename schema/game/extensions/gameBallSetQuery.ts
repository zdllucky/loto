import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

const gameBallSetQuery: Extension = () => {
  return graphql.field({
    type: graphql.nonNull(graphql.list(graphql.nonNull(graphql.Int))),
    args: {},
    resolve: async (rootVal, _, context: Context) => {
      const sCtx = context.sudo();

      const game = await sCtx.prisma.game.findFirst({
        where: { users: { some: { id: context.session?.itemId ?? "" } } },
        select: {
          step: true,
          balls: true,
        },
      });

      if (!game) return [];

      return (
        (game?.balls as Array<number>)
          .slice(Math.max(game.step - 5, 0), game.step)
          .reverse() ?? []
      );
    },
  });
};

export default gameBallSetQuery;
