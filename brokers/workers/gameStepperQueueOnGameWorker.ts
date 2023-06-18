import { Queues } from "../consts";
import { Queue, Worker } from "bullmq";
import { Context } from ".keystone/types";
import { Prisma } from ".prisma/client";

const gameStepperQueueOnGameWorkerInit = ({
  context,
  gameStepperQueueOnGameQueue,
  botMoveSimulationQueue,
}: {
  context: Context;
  gameStepperQueueOnGameQueue: Queue;
  botMoveSimulationQueue: Queue;
}) =>
  new Worker(Queues.gameStepperQueueOnGame.name, async ({ data }) => {
    const sCtx = context.sudo();
    const { gameId, speed } = data;

    return await sCtx.prisma.$transaction(async (prisma) => {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        select: {
          step: true,
          speed: true,
          gameStatus: true,
          balls: true,
        },
      });

      const removeQueue = async () => {
        await gameStepperQueueOnGameQueue.removeRepeatableByKey(
          `${gameId}:${gameId}:::${16000 / speed}`
        );
      };

      if (!game) {
        await removeQueue();
        return { success: false, message: "Game does not exist" };
      }

      if (game.gameStatus === "waiting") {
        await removeQueue();
        return { success: false, message: "Game hasn't started yet" };
      }

      if (game.gameStatus === "finished") {
        await removeQueue();
        return { success: false, message: "Game already finished" };
      }

      if (game.step === 90) {
        await prisma.game.update({
          where: { id: gameId },
          data: { gameStatus: { set: "finished" } },
        });

        await removeQueue();

        return { success: true, message: "Game finished", gameId };
      } else {
        await prisma.game.update({
          where: { id: gameId },
          data: { step: { increment: 1 } },
        });

        await botMoveSimulationQueue.add("botMoveSimulation", {
          gameId,
          ball: (game.balls as Prisma.JsonArray)[game.step],
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
