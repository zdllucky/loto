import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";

import { PersonalStatsRating } from "./personalStatsRatingQuery";
import { redisCache } from "../../../configuration/db";

type UserRating = {
  login: string | null;
  winRating: number | null;
  skillRating: number | null;
};

const totalStatsRatingQuery: Extension = () => {
  const UserRating = graphql.object<UserRating>()({
    name: "UserRating",
    fields: {
      login: graphql.field({ type: graphql.String }),
      winRating: graphql.field({ type: graphql.Int }),
      skillRating: graphql.field({ type: graphql.Float }),
    },
  });

  const SelfRating = graphql.object<Omit<UserRating, "login">>()({
    name: "SelfRating",
    fields: {
      winRating: graphql.field({ type: graphql.Int }),
      skillRating: graphql.field({ type: graphql.Float }),
    },
  });

  const TotalStatsRating = graphql.object<{
    leaders: UserRating[];
    selfRating: Omit<UserRating, "login"> | null;
    offset: number;
    page: number;
  }>()({
    name: "TotalStatsRating",
    fields: {
      leaders: graphql.field({
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
          leaders: [],
          selfRating: null,
          offset,
          page,
        };

      const sCtx = context.sudo();

      const dateOffset = new Date(Date.now() - 1000 * offset);
      dateOffset.setMinutes(0);
      dateOffset.setSeconds(0);
      dateOffset.setMilliseconds(0);

      const topUserRating = await redisCache.wrap(
        "topUserRating",
        async () => {
          process.env.NODE_ENV === "development" &&
            console.log("topUserRatingQuery");
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
                LIMIT 10 OFFSET ${(page - 1) * 10}
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
                LIMIT 10 OFFSET ${(page - 1) * 10}
              )
              SELECT
                q.login as login,
                w.sum::integer as "winRating",
                w.sum / (1 + CAST(q.count AS FLOAT) - w.wincount) as "skillRating"
              FROM q
              JOIN w on q.login = w.login;
      `;
        },
        process.env.NODE_ENV === "production" ? 60 * 60 * 1000 : 5 * 1000
      );

      return {
        leaders: topUserRating,
        selfRating,
        offset,
        page,
      };
    },
  });
};

export default totalStatsRatingQuery;
