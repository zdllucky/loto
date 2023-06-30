import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";

export type PersonalStatsRating = {
  winRating: number | null;
  skillRating: number | null;
  gamesPlayed: number | null;
  offset: number;
};
const personalStatsRatingQuery: Extension = () => {
  const PersonalStatsRating = graphql.object<PersonalStatsRating>()({
    name: "PersonalStatsRating",
    fields: {
      winRating: graphql.field({ type: graphql.Int }),
      skillRating: graphql.field({ type: graphql.Float }),
      gamesPlayed: graphql.field({ type: graphql.Int }),
      offset: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(PersonalStatsRating),
    args: {
      offset: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
    },
    resolve: async (rootVal, { offset }, context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId)
        return {
          winRating: null,
          skillRating: null,
          gamesPlayed: null,
          offset: offset,
        };

      const user = await sCtx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user)
        return {
          winRating: null,
          skillRating: null,
          gamesPlayed: null,
          offset: offset,
        };

      const dateOffset = new Date(Date.now() - 1000 * offset);
      dateOffset.setMinutes(0);
      dateOffset.setSeconds(0);
      dateOffset.setMilliseconds(0);

      const sum = await sCtx.prisma.gameResult.aggregate({
        _sum: {
          gameDifficulty: true,
        },
        where: {
          winnerPlayerLogin: {
            equals: context.session?.data.login,
          },
          createdAt: {
            gt: dateOffset,
          },
        },
      });

      const count = await sCtx.prisma.gameResult.count({
        where: {
          players: {
            some: {
              login: {
                equals: context.session?.data.login,
              },
            },
          },
          winnerPlayerLogin: {
            not: {
              equals: context.session?.data.login,
            },
          },
          createdAt: {
            gt: dateOffset,
          },
        },
      });

      return {
        winRating: sum._sum.gameDifficulty,
        skillRating: sum._sum.gameDifficulty && sum._sum.gameDifficulty / count,
        gamesPlayed: count,
        offset,
      };
    },
  });
};

export default personalStatsRatingQuery;
