import { Queue, Worker } from "bullmq";
import { Context } from ".keystone/types";
import { Queues } from "../consts";

const generateGameStepperQueuesOnGameWorkerInit = ({
  gameStepperQueueOnGameQueue,
  context,
}: {
  gameStepperQueueOnGameQueue: Queue;
  context: Context;
}) =>
  new Worker(Queues.generateGameStepperQueueOnGames.name, async () => {
    const sCtx = context.sudo();

    const gamesCount = await sCtx.prisma.game.count({
      where: { gameStatus: { equals: "waiting" } },
    });

    let offset = 0;

    while (offset < gamesCount) {
      const games = await sCtx.prisma.game.findMany({
        skip: offset,
        take: 20,
        where: { gameStatus: { equals: "waiting" } },
      });

      await Promise.all(
        games.map(async (game) => {
          await sCtx.prisma.game.update({
            where: { id: game.id },
            data: { gameStatus: { set: "playing" } },
          });

          await gameStepperQueueOnGameQueue.add(
            game.id,
            { gameId: game.id, speed: game.speed },
            {
              repeat: { every: 16000 / game.speed },
              repeatJobKey: game.id,
              jobId: game.id,
            }
          );
        })
      );

      offset += 20;
    }

    return { gamesCount };
  });

export default generateGameStepperQueuesOnGameWorkerInit;