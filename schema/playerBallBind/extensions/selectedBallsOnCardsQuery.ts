import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

const selectedBallsOnCardsQuery: Extension = (schema) => {
  const CardWithSelectedBalls = graphql.object<{
    cardId: string;
    balls: number[];
  }>()({
    name: "CardWithSelectedBalls",
    fields: {
      cardId: graphql.field({ type: graphql.nonNull(graphql.ID) }),
      balls: graphql.field({
        type: graphql.nonNull(graphql.list(graphql.nonNull(graphql.Int))),
      }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(graphql.list(CardWithSelectedBalls)),
    args: {
      cardIds: graphql.arg({
        type: graphql.nonNull(graphql.list(graphql.nonNull(graphql.ID))),
      }),
    },
    resolve: async (rootVal, { cardIds }, context: Context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return [];

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          from_PlayerBallBind_user: {
            where: {
              card: { id: { in: cardIds } },
            },
            select: {
              cardId: true,
              number: true,
            },
          },
        },
      });

      if (!user) return [];

      return cardIds.map((cId) => ({
        cardId: cId,
        balls: user.from_PlayerBallBind_user
          .filter(({ cardId }) => cardId === cId)
          .map(({ number }) => number),
      }));
    },
  });
};

export default selectedBallsOnCardsQuery;
