import { Context } from ".keystone/types";
import { connection, Queues } from "../consts";
import { Queue, Worker } from "bullmq";
const finishGameEventWorkerInit = ({
  context,
  finishGameProcedureQueue,
}: {
  context: Context;
  finishGameProcedureQueue: Queue;
}) =>
  new Worker(
    Queues.finishGameEvent.name,
    async () => {
      const sCtx = context.sudo();

      return await sCtx.prisma.$transaction(async (prisma) => {
        const finishedGamesCount = await prisma.game.count({
          where: { gameStatus: "finished", resultId: null },
        });

        let offset = 0;

        while (offset < finishedGamesCount) {
          const games = await prisma.game.findMany({
            where: { gameStatus: "finished", resultId: null },
            skip: offset,
            take: 20,
          });

          offset += 20;

          await Promise.all(
            games.map((game) =>
              finishGameProcedureQueue.add("Game finish", {
                gameId: game.id,
              })
            )
          );
        }
      });
    },
    { connection }
  );

export default finishGameEventWorkerInit;
