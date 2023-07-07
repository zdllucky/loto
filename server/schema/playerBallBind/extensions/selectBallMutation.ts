import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";
import { Prisma } from ".prisma/client";

const selectBallMutation: Extension = () => {
  const SelectBallResult = graphql.object<{
    success: boolean;
    message: string | undefined;
  }>()({
    name: "SelectBallResult",
    fields: {
      success: graphql.field({ type: graphql.nonNull(graphql.Boolean) }),
      message: graphql.field({ type: graphql.String }),
    },
  });

  return graphql.field({
    type: graphql.nonNull(SelectBallResult),
    args: {
      number: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
      cardId: graphql.arg({ type: graphql.nonNull(graphql.ID) }),
    },
    resolve: async (rootVal, { number, cardId }, context) => {
      const sCtx = context.sudo();

      const userId = context.session?.itemId;

      if (!userId) return { success: false, message: "server.unauthorized" };

      const user = await sCtx.prisma.user.findUnique({
        where: { id: context.session?.itemId },
        select: {
          game: {
            select: {
              id: true,
              balls: true,
              step: true,
              speed: true,
              gameStatus: true,
            },
          },
          from_PlayerBallBind_user: {
            where: {
              card: { id: { equals: cardId } },
              number: { equals: number },
            },
            select: { id: true },
          },
          from_Card_user: {
            where: {
              userId: { equals: userId },
              id: { equals: cardId },
              numbers: { array_contains: number },
            },
            select: {
              gameId: true,
              numbers: true,
            },
          },
        },
      });

      if (!user) return { success: false, message: "server.userNotFound" };

      if (!user.game)
        return { success: false, message: "server.game.notFound" };

      if (user.game.gameStatus === "finished")
        return { success: false, message: "server.game.finishedAlready" };

      if (user.game.gameStatus === "waiting")
        return { success: false, message: "server.game.notStartedYet" };

      if (user.from_Card_user.length === 0)
        return {
          success: false,
          message: "server.game.cards.notFoundForNumber",
        };

      if (user.game.id !== user.from_Card_user[0].gameId)
        return { success: false, message: "server.game.cards.notFoundForGame" };

      if (user.from_PlayerBallBind_user.length > 0)
        return { success: true, message: "server.game.balls.alreadySelected" };

      const balls = user.game.balls as Prisma.JsonArray;

      if (
        !balls
          .slice(Math.max(0, user.game.step - 5), user.game.step)
          .includes(number)
      )
        return { success: false, message: "server.game.balls.cantSelectNow" };

      const res = await sCtx.prisma.playerBallBind.create({
        data: {
          userId: userId,
          number,
          cardId: cardId,
          gameId: user.game.id,
        },
      });

      const ballsCount = await sCtx.prisma.playerBallBind.count({
        where: {
          userId: userId,
          gameId: user.game.id,
          cardId,
        },
      });

      if (ballsCount >= 15) {
        await sCtx.prisma.game.update({
          where: { id: user.game.id },
          data: { gameStatus: "finished" },
        });
      }

      if (!res)
        return { success: false, message: "server.game.balls.failedToSelect" };

      return { success: true, message: "server.game.balls.selected" };
    },
  });
};

export default selectBallMutation;
