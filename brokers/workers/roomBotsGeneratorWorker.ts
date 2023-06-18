import { Context } from ".keystone/types";
import { Worker } from "bullmq";
import { Queues } from "../consts";
import { generateUsername } from "unique-username-generator";
const roomBotsGeneratorWorkerInit = (context: Context) =>
  new Worker(Queues.roomBotsGenerator.name, async ({ data }) => {
    const { amount, addToSubtractProbability, changeProbability } = data;
    const sCtx = context.sudo();

    if (
      (await sCtx.db.Room.count()) >
      Queues.roomGenerator.options.amount.max * 2
    )
      return { message: "Too many rooms" };

    const rooms = await sCtx.query.Room.findMany({
      query: "id, botsCount, bots { id }, users { id }, usersCount",
    });

    const bots = rooms.reduce(
      (acc, room) => {
        if (
          Math.random() < changeProbability &&
          room.botsCount + room.usersCount < amount
        ) {
          const shouldAdd =
            Math.random() < addToSubtractProbability ||
            room.botsCount < 2 ||
            room.usersCount > 0;

          if (shouldAdd) {
            return {
              ...acc,
              add: [
                ...acc.add,
                {
                  roomId: room.id,
                  accuracy: randomBotAccuracy(),
                  login: generateUsername("", 2, 15),
                },
              ],
            };
          } else
            return {
              ...acc,
              remove: [
                ...acc.remove,
                room.bots[Math.floor(Math.random() * room.bots.length)].id,
              ],
            };
        }

        return acc;
      },
      { add: [], remove: [] }
    );

    await sCtx.prisma.$transaction([
      sCtx.prisma.bot.createMany({ data: bots.add }),
      sCtx.prisma.bot.deleteMany({ where: { id: { in: bots.remove } } }),
    ]);

    return { message: "Complete", bots };
  });

const randomBotAccuracy = () => {
  const accuracySelect = Math.floor(Math.random() * 4);

  switch (accuracySelect) {
    case 0:
      return 9999;
    case 1:
      return 9900;
    case 2:
      return 9800;
    case 3:
      return 9000;
  }
};

export default roomBotsGeneratorWorkerInit;
