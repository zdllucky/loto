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
          },
        },
      },
    });

    if (!game) return { success: false, message: "Game not found" };

    if (game.gameStatus === "waiting")
      return { success: false, message: "Game not started yet" };

    if (game.gameStatus === "finished")
      return { success: false, message: "Game already finished" };

    await sCtx.prisma.playerBallBind.createMany({
      data: game.bots
        .map((bot) => {
          const accuracy = (bot.accuracy ?? 9999) / 100;

          const suitableCards = bot.from_Card_bot.filter(
            ({ numbers }) =>
              (numbers as Prisma.JsonArray).includes(ball) &&
              Math.random() < accuracy
          );

          return suitableCards.map(({ id }) => ({
            number: ball,
            cardId: id,
            botId: bot.id,
            gameId: game.id,
          }));
        })
        .flat(),
    });

    return { message: "Complete", botIds: game.bots.map(({ id }) => id) };
  });

export default botMoveSimulationWorkerInit;
