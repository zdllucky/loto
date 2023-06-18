import { Queues } from "../consts";
import { Queue, Worker } from "bullmq";
import { Context } from ".keystone/types";

const gameStepperQueueOnGameWorkerInit = ({
  context,
  gameStepperQueueOnGameQueue,
}: {
  context: Context;
  gameStepperQueueOnGameQueue: Queue;
}) =>
  new Worker(Queues.gameStepperQueueOnGame.name, async ({ data }) => {
    const sCtx = context.sudo();
    const { gameId, speed } = data;

    return await sCtx.prisma.$transaction(async (prisma) => {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        select: { step: true, speed: true, gameStatus: true },
      });

      if (!game) {
        await gameStepperQueueOnGameQueue.removeRepeatableByKey(
          `${gameId}:${gameId}:::${16000 / speed}`
        );
        return { success: false, message: "Game does not exist" };
      }

      if (game.gameStatus === "playing") {
        await gameStepperQueueOnGameQueue.removeRepeatableByKey(
          `${gameId}:${gameId}:::${16000 / speed}`
        );
        return { success: false, message: "Game is not in active play" };
      }

      if (game.step === 90) {
        await prisma.game.update({
          where: { id: gameId },
          data: { gameStatus: { set: "finished" } },
        });

        await gameStepperQueueOnGameQueue.removeRepeatableByKey(
          `${gameId}:${gameId}:::${16000 / game.speed}`
        );

        return { success: true, message: "Game finished", gameId };
      } else {
        await prisma.game.update({
          where: { id: gameId },
          data: { step: { increment: 1 } },
        });

        const nextStep = game.step + 1;

        return {
          success: true,
          message: `Game step: ${nextStep}`,
          gameId,
          step: nextStep,
        };
      }
    });
  });

export default gameStepperQueueOnGameWorkerInit;
