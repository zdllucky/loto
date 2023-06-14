import { Context } from ".keystone/types";
import { Queue, Worker } from "bullmq";
import { connection, Queues } from "../consts";
const createGameEventWorkerInit = ({ context }: { context: Context }) =>
  new Worker(Queues.createGameEvent.name, async ({ data }) => {
    const { limit } = data;
    const sCtx = context.sudo();
    const createGameProcedureQueue = new Queue(
      Queues.createGameProcedure.name,
      { connection }
    );

    const res = await sCtx.prisma.$transaction(async (prisma) => {
      const [{ room_count }] = await prisma.$queryRaw<[{ room_count: number }]>`
          SELECT COUNT(*) as room_count
          FROM "Room"
          WHERE "Room".id IN (
              SELECT room
              FROM (
                       SELECT room, COUNT(*) AS cnt
                       FROM (
                                SELECT room FROM "User"
                                UNION ALL
                                SELECT room FROM "Bot"
                            ) AS unioned
                       GROUP BY room
                   ) AS counts
              WHERE counts.cnt >= 5
          )
            AND EXISTS (
              SELECT 1 FROM "User"
              WHERE "User".room = "Room".id
          )
      `;

      for (let offset = 0; offset < room_count; offset += limit) {
        const rooms = await prisma.$queryRaw<{ id: string }[]>`
          SELECT id
          FROM "Room"
          WHERE "Room".id IN (
              SELECT room
              FROM (
                       SELECT room, COUNT(*) AS cnt
                       FROM (
                                SELECT room FROM "User"
                                UNION ALL
                                SELECT room FROM "Bot"
                            ) AS unioned
                       GROUP BY room
                   ) AS counts
              WHERE counts.cnt >= 5
          )
            AND EXISTS (
              SELECT 1 FROM "User"
              WHERE "User".room = "Room".id
          )
          LIMIT ${limit} OFFSET ${offset}
      `;

        await Promise.all(
          rooms.map(async ({ id }) => {
            await createGameProcedureQueue.add("createGameProcedure", {
              roomId: id,
            });
          })
        );
      }

      return { room_count };
    });

    return { message: "Complete", res };
  });

export default createGameEventWorkerInit;
