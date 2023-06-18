import { Context } from ".keystone/types";
import { Worker } from "bullmq";
import { Queues } from "../consts";
import { Prisma } from ".prisma/client";
const botMoveSimulationWorkerInit = ({ context }: { context: Context }) =>
  new Worker(Queues.botMoveSimulation.name, async ({ data }) => {
    const { gameId, ball } = data;
    const sCtx = context.sudo();

    const game = await sCtx.prisma.game.findUnique({
      where: { id: gameId },
      select: {
        id: true,
        gameStatus: true,
        bots: {
          select: {
            id: true,
            accuracy: true,
            from_Card_bot: {
              select: {
                id: true,
                numbers: true,
              },
            },
            from_PlayerBallBind_bot: {
              select: {
                cardId: true,
                number: true,
              },
            },
          },
        },
      },
    });

    if (!game) return { success: false, message: "Game not found" };

    if (game.gameStatus === "waiting")
      return { success: false, message: "Game not started yet" };

    if (game.gameStatus === "finished")
      return { success: false, message: "Game already finished" };

    let winnerCardId: string | undefined;

    await sCtx.prisma.playerBallBind.createMany({
      data: game.bots
        .map((bot) => {
          const accuracy = (bot.accuracy ?? 9999) / 100;

          const suitableCards = bot.from_Card_bot.filter(
            ({ numbers }) =>
              (numbers as Prisma.JsonArray).includes(ball) &&
              Math.random() < accuracy
          );

          winnerCardId ??= suitableCards.find(
            ({ id }) =>
              bot.from_PlayerBallBind_bot.filter(({ cardId }) => cardId === id)
                .length >= 14
          )?.id;

          // TODO: Schedule gameEnd event

          return suitableCards.map(({ id }) => ({
            number: ball,
            cardId: id,
            botId: bot.id,
            gameId: game.id,
          }));
        })
        .flat(),
    });

    if (winnerCardId) {
      await sCtx.prisma.game.update({
        where: { id: gameId },
        data: { gameStatus: { set: "finished" } },
      });
    }

    return {
      message: "Complete",
      botIds: game.bots.map(({ id }) => id),
      winnerCardId,
    };
  });

export default botMoveSimulationWorkerInit;
