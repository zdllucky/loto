import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";

import { PersonalStatsRating } from "./personalStatsRatingQuery";
import { redisCache } from "../../../configuration/db";

type UserRating = {
  login: string | null;
  stat: number | null;
};

type SelfRating = {
  winRating: number | null;
  skillRating: number | null;
};

const totalStatsRatingQuery: Extension = () => {
  const UserRating = graphql.object<UserRating>()({
    name: "UserRating",
    fields: {
      login: graphql.field({ type: graphql.String }),
      stat: graphql.field({ type: graphql.Float }),
    },
  });

  const SelfRating = graphql.object<SelfRating>()({
    name: "SelfRating",
    fields: {
      winRating: graphql.field({ type: graphql.Int }),
      skillRating: graphql.field({ type: graphql.Float }),
    },
  });

  const TotalStatsRating = graphql.object<{
    winRating: UserRating[];
    skillRating: UserRating[];
    selfRating: SelfRating | null;
    offset: number;
    page: number;
  }>()({
    name: "TotalStatsRating",
    fields: {
      winRating: graphql.field({
        type: graphql.list(graphql.nonNull(UserRating)),
      }),
      skillRating: graphql.field({
        type: graphql.list(graphql.nonNull(UserRating)),
      }),
      selfRating: graphql.field({ type: SelfRating }),
      offset: graphql.field({ type: graphql.nonNull(graphql.Int) }),
      page: graphql.field({ type: graphql.nonNull(graphql.Int) }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(TotalStatsRating),
    args: {
      offset: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
      page: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
    },
    resolve: async (rootVal, { offset, page }, context) => {
      const personalStatsRes = await context.graphql.run<
        { personalStatsRating: PersonalStatsRating },
        { offset: number }
      >({
        query: `
          query PersonalStatsRating($offset: Int!) {
            personalStatsRating(offset: $offset) {
              gamesPlayed
              offset
              skillRating
              winRating
            }
          }
        `,
        variables: {
          offset,
        },
      });

      const selfRating = personalStatsRes.personalStatsRating;

      if (selfRating.gamesPlayed === null)
        return {
          winRating: [],
          skillRating: [],
          selfRating: null,
          offset,
          page,
        };

      const sCtx = context.sudo();

      const dateOffset = new Date(Date.now() - 1000 * offset);
      dateOffset.setMinutes(0);
      dateOffset.setSeconds(0);
      dateOffset.setMilliseconds(0);

      const topUserRatingKey = `topUserRating:${page}:${dateOffset.toISOString()}`;

      const topUserRating = await redisCache.wrap(
        topUserRatingKey,
        async () => {
          process.env.NODE_ENV === "development" &&
            console.log(topUserRatingKey);

          return await sCtx.prisma.$queryRaw<UserRating[]>`
            WITH q AS (
                SELECT
                    "User"."login",
                    COUNT(CASE WHEN "GRp"."B" = "User"."login" THEN 1 ELSE 0 END) as count
                FROM "User"
                         JOIN "_GameResult_players" "GRp" on "User".id = "GRp"."B"
                         JOIN "GameResult" G on G.id = "GRp"."A"
                WHERE
                        G."createdAt" > ${dateOffset.toISOString()}::TIMESTAMP
                GROUP BY "User"."login"
              ),
              w AS (
                SELECT
                    "User"."login",
                    SUM(CASE WHEN GR."winnerPlayerLogin" = "User".login THEN GR."gameDifficulty" ELSE 0 END ) as sum,
                    COUNT(CASE WHEN GR."winnerPlayerLogin" = "User".login THEN 1 ELSE 0 END ) as "wincount"
                FROM "User"
                         JOIN "GameResult" GR on "User".login = GR."winnerPlayerLogin"
                WHERE
                        GR."createdAt" > ${dateOffset.toISOString()}::TIMESTAMP
                GROUP BY "User"."login"
                ORDER BY sum DESC
              ),
            e AS (SELECT 
              w.login as login,
              w.sum / (1 + CAST(q.count AS FLOAT) - w.wincount) as "stat"
                FROM q
                JOIN w on q.login = w.login
                ORDER BY "stat" DESC
                LIMIT 10 OFFSET ${(page - 1) * 10})
            
            SELECT * FROM e
            UNION ALL
            SELECT * FROM (VALUES ('__separator', -1)) as t(login, stat)
            UNION ALL
            SELECT login, sum::integer as stat FROM w LIMIT 10 OFFSET ${
              (page - 1) * 10
            };
            
      `;
        },
        process.env.NODE_ENV === "production" ? 60 * 60 * 1000 : 5 * 1000
      );

      const skillRating = topUserRating.slice(
        0,
        topUserRating.findIndex(
          ({ login, stat }) => login === "__separator" && stat === -1
        )
      );

      const winRating = topUserRating.slice(skillRating.length + 1);

      return {
        winRating,
        skillRating,
        selfRating,
        offset,
        page,
      };
    },
  });
};

export default totalStatsRatingQuery;
