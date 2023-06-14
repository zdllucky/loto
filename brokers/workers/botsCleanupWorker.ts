import { Context } from ".keystone/types";
import { Worker } from "bullmq";
import { Queues } from "../consts";
const botsCleanupWorkerInit = ({ context }: { context: Context }) =>
  new Worker(Queues.botsCleanup.name, async () => {
    const sCtx = context.sudo();

    const { count } = await sCtx.prisma.bot.deleteMany({
      where: { roomId: { equals: null } },
    });

    return { message: "Complete", count };
  });

export default botsCleanupWorkerInit;