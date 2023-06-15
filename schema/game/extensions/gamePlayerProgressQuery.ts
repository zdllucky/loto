import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";
import { Prisma } from ".prisma/client";

const gamePlayerProgressQuery: Extension = (schema) => {
  const Player = graphql.object<{
    id: string;
    login: string;
    progress: Array<number>;
  }>()({
    name: "Player",
    fields: {
      id: graphql.field({ type: graphql.nonNull(graphql.ID) }),
      login: graphql.field({ type: graphql.nonNull(graphql.String) }),
      progress: graphql.field({
        type: graphql.list(graphql.nonNull(graphql.Int)),
        resolve: (source, args) => source.progress,
      }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(graphql.list(graphql.nonNull(Player))),
    args: {},
    resolve: async (rootVal, _, context: Context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return [];

      const user = await sCtx.db.User.findOne({
        where: { id: context.session?.itemId },
      });

      if (!user?.gameId) return [];

      const game = await sCtx.prisma.game.findUnique({
        where: { id: user.gameId },
        select: {
          id: true,
          createdAt: true,
          speed: true,
          balls: true,
          users: {
            select: {
              id: true,
              login: true,
              from_PlayerBallBind_user: {
                select: {
                  number: true,
                },
              },
              from_Card_user: {
                select: {
                  numbers: true,
                },
              },
            },
          },
          bots: {
            select: {
              id: true,
              login: true,
              from_PlayerBallBind_bot: {
                select: {
                  number: true,
                },
              },
              from_Card_bot: {
                select: {
                  numbers: true,
                },
              },
            },
          },
        },
      });

      if (!game) return [];

      const players = [
        ...game.users
          .filter(({ id }) => id !== userId)
          .map((user) => ({
            ...user,
            cards: user.from_Card_user,
            balls: user.from_PlayerBallBind_user.map(({ number }) => number),
            from_PlayerBallBind_user: undefined,
            from_Card_user: undefined,
          })),
        ...game.bots.map((bot) => ({
          ...bot,
          cards: bot.from_Card_bot,
          balls: bot.from_PlayerBallBind_bot.map(({ number }) => number),
          from_PlayerBallBind_bot: undefined,
          from_Card_bot: undefined,
        })),
      ];

      return players.map((player) => ({
        id: player.id,
        login: player.login,
        progress: player.cards.map((card) =>
          (card.numbers as Prisma.JsonArray).reduce(
            (score: number, ball) =>
              player.balls.includes(ball as number) ? score + 1 : score,
            0
          )
        ),
      }));
    },
  });
};

export default gamePlayerProgressQuery;
