import { Context } from ".keystone/types";
import { Queues } from "./consts";
import { Worker } from "bullmq";
const fullFakeRoomCleanupWorkerInit = ({ context }: { context: Context }) =>
  new Worker(Queues.fullFakeRoomCleanup.name, async () => {
    const sCtx = context.sudo();

    const count = await sCtx.prisma
      .$executeRaw`DELETE FROM "Room" WHERE id IN (SELECT room FROM "Bot" GROUP BY room HAVING COUNT(*) = 5)`;

    return { message: "Complete", count };
  });

export default fullFakeRoomCleanupWorkerInit;
