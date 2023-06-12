import { Context } from ".keystone/types";
import { Queue } from "bullmq";
import roomGeneratorWorkerInit from "./roomGeneratorWorker";
import { connection, Queues } from "./consts";
import roomBotsGeneratorWorkerInit from "./roomBotsGeneratorWorker";
import botsCleanupWorkerInit from "./botsCleanupWorker";
import fullFakeRoomCleanupWorkerInit from "./fullFakeRoomCleanupWorker";

const initMQService = async ({ context }: { context: Context }) => ({
  ...(await initRoomGenerator({ context })),
  ...(await initRoomBotsGenerator({ context })),
  ...(await initBotsCleanup({ context })),
  ...(await initFullFakeRoomCleanup({ context })),
});

const initFullFakeRoomCleanup = async ({ context }: { context: Context }) => {
  const fullFakeRoomCleanupQueue = new Queue(Queues.fullFakeRoomCleanup.name, {
    connection,
  });

  const fullFakeRoomCleanupWorker = fullFakeRoomCleanupWorkerInit({ context });

  fullFakeRoomCleanupWorker.isRunning() ||
    (await fullFakeRoomCleanupWorker.run());

  await fullFakeRoomCleanupQueue.add(
    "cleanupRepeatedly",
    {},
    { repeat: Queues.fullFakeRoomCleanup.options.repeat }
  );

  return { fullFakeRoomCleanupQueue, fullFakeRoomCleanupWorker };
};

const initBotsCleanup = async ({ context }: { context: Context }) => {
  const botsCleanupQueue = new Queue(Queues.botsCleanup.name, { connection });

  const botsCleanupWorker = botsCleanupWorkerInit({ context });

  botsCleanupWorker.isRunning() || (await botsCleanupWorker.run());

  await botsCleanupQueue.add(
    "cleanupRepeatedly",
    {},
    { repeat: Queues.botsCleanup.options.repeat }
  );

  return { botsCleanupQueue, botsCleanupWorker };
};

const initRoomBotsGenerator = async ({ context }: { context: Context }) => {
  const roomBotsGeneratorQueue = new Queue(Queues.roomBotsGenerator.name, {
    connection,
  });

  const roomBotsGeneratorWorker = roomBotsGeneratorWorkerInit(context);

  roomBotsGeneratorWorker.isRunning() || (await roomBotsGeneratorWorker.run());

  await roomBotsGeneratorQueue.add(
    "generateRepeatedly",
    {
      amount: Queues.roomBotsGenerator.options.amount,
      addToSubtractProbability:
        Queues.roomBotsGenerator.options.addToSubtractProbability,
      changeProbability: Queues.roomBotsGenerator.options.changeProbability,
    },
    { repeat: Queues.roomBotsGenerator.options.repeat }
  );

  return { roomBotsGeneratorQueue, roomBotsGeneratorWorker };
};

const initRoomGenerator = async ({ context }: { context: Context }) => {
  const roomGeneratorQueue = new Queue(Queues.roomGenerator.name, {
    connection,
  });

  const roomGeneratorWorker = roomGeneratorWorkerInit(context);

  roomGeneratorWorker.isRunning() || (await roomGeneratorWorker.run());

  await roomGeneratorQueue.add(
    "generateRepeatedly",
    { amount: Queues.roomGenerator.options.amount },
    { repeat: Queues.roomGenerator.options.repeat }
  );

  return { roomGeneratorQueue, roomGeneratorWorker };
};

export default initMQService;
