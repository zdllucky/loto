import { Context } from ".keystone/types";
import { Worker } from "bullmq";
import { connection, Queues } from "../consts";
const botsCleanupWorkerInit = ({ context }: { context: Context }) =>
  new Worker(
    Queues.botsCleanup.name,
    async () => {
      const sCtx = context.sudo();

      const { count } = await sCtx.prisma.bot.deleteMany({
        where: {
          AND: [{ roomId: { equals: null } }, { gameId: { equals: null } }],
        },
      });

      return { message: "Complete", count };
    },
    {
      connection,
      removeOnComplete: {
        count: 1000,
      },
      removeOnFail: {
        count: 1000,
      },
    }
  );

export default botsCleanupWorkerInit;
