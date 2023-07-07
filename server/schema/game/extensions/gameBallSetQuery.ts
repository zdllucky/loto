import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";
import { redisCache } from "../../../configuration/db";

const gameBallSetQuery: Extension = () => {
  const GameBalls = graphql.object<{ balls: number[]; gameStatus: string }>()({
    name: "GameBalls",
    fields: {
      gameStatus: graphql.field({ type: graphql.nonNull(graphql.String) }),
      balls: graphql.field({
        type: graphql.nonNull(graphql.list(graphql.nonNull(graphql.Int))),
      }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(GameBalls),
    args: {
      gameId: graphql.arg({ type: graphql.ID }),
    },
    resolve: async (rootVal, { gameId }, context) => {
      const sCtx = context.sudo();

      /** Checking cache set on [worker]{@link gameStepperQueueOnGameWorkerInit } */
      // TODO: add stronger game and user validation
      if (gameId && context.session) {
        const cache = await redisCache.get<{
          gameStatus: string;
          balls: number[];
        }>(`game_balls:${gameId}`);

        if (cache) return cache;
      }

      const game = await sCtx.prisma.game.findFirst({
        where: { users: { some: { id: context.session?.itemId ?? "" } } },
        orderBy: { createdAt: "desc" },
        select: {
          step: true,
          gameStatus: true,
          balls: true,
        },
      });

      if (!game)
        return {
          gameStatus: "undefined",
          balls: [],
        };

      return {
        gameStatus: game?.gameStatus ?? "undefined",
        balls:
          (game?.balls as Array<number>)
            .slice(Math.max(game.step - 5, 0), game.step)
            .reverse() ?? [],
      };
    },
  });
};

export default gameBallSetQuery;
