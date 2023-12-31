import { Worker, Job } from "bullmq";
import { connection, Queues } from "../consts";
import { Context } from ".keystone/types";
import cuid from "cuid";
import { generateUsername } from "unique-username-generator";

const roomGeneratorWorkerInit = (context: Context) =>
  new Worker(
    Queues.roomGenerator.name,
    async ({ data }: Job) => {
      const { min, max } = data.amount;
      const sCtx = context.sudo();
      const roomsCount = await sCtx.prisma.room.count();
      const nextRandomAmount = Math.floor(Math.random() * (max - min) + min);

      if (roomsCount < nextRandomAmount) {
        const roomsToCreate = nextRandomAmount - roomsCount;

        const roomsData = Array.from({ length: roomsToCreate }).map(() => ({
          speed: getRandomSpeed(),
          createdAt: new Date(),
          id: cuid(),
        }));

        const botsData = Array.from({ length: roomsToCreate }).map((_, i) => ({
          roomId: roomsData[i].id,
          login: generateUsername("", 2, 15),
        }));

        try {
          await sCtx.prisma.$transaction(async () => {
            await sCtx.prisma.room.createMany({ data: roomsData });
            await sCtx.prisma.bot.createMany({ data: botsData });
          });
        } catch (e: any) {
          if (
            e.message &&
            (e.message as string).includes("Unique constraint failed")
          )
            return { success: false, message: e.message };
          else throw e;
        }
        return { success: true, rooms: roomsData, bots: botsData };
      }
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

const getRandomSpeed = () => Math.floor(Math.random() * 3) + 2;

export default roomGeneratorWorkerInit;
