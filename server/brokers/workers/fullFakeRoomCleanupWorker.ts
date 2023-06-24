import { Context } from ".keystone/types";
import { connection, Queues } from "../consts";
import { Worker } from "bullmq";
const fullFakeRoomCleanupWorkerInit = ({ context }: { context: Context }) =>
  new Worker(
    Queues.fullFakeRoomCleanup.name,
    async () => {
      const sCtx = context.sudo();

      const data = await sCtx.prisma.$transaction(async (prisma) => {
        await prisma.$executeRaw`
        DELETE FROM "Room" 
        WHERE id IN (SELECT room FROM "Bot" GROUP BY room HAVING COUNT(*) = 5) 
          AND (SELECT COUNT(*) FROM "User" WHERE room = "Room".id) = 0`;
        await prisma.$executeRaw`UPDATE "Bot" SET room = NULL WHERE room NOT IN (SELECT id FROM "Room")`;
      });

      return { message: "Complete", data };
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

export default fullFakeRoomCleanupWorkerInit;
