import { Context } from ".keystone/types";
import { Queue } from "bullmq";
import roomGeneratorWorkerInit from "./workers/roomGeneratorWorker";
import { connection, Queues } from "./consts";
import roomBotsGeneratorWorkerInit from "./workers/roomBotsGeneratorWorker";
import botsCleanupWorkerInit from "./workers/botsCleanupWorker";
import fullFakeRoomCleanupWorkerInit from "./workers/fullFakeRoomCleanupWorker";
import createGameEventWorkerInit from "./workers/createGameEventWorker";
import createGameProcedureWorkerInit from "./workers/createGameProcedureWorker";
import generateGameStepperQueuesOnGameWorkerInit from "./workers/generateGameStepperQueuesOnGameWorker";
import gameStepperQueueOnGameWorkerInit from "./workers/gameStepperQueueOnGameWorker";
export interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => string;
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  try {
    const number = Number(this.toString());
    if (Number.isNaN(number)) {
      throw new Error("Not a number");
    }

    return number;
  } catch (e) {
    return this.toString();
  }
};

const initMQService = async ({ context }: { context: Context }) => ({
  ...(await initRoomGenerator({ context })),
  ...(await initRoomBotsGenerator({ context })),
  ...(await initBotsCleanup({ context })),
  ...(await initFullFakeRoomCleanup({ context })),
  ...(await initCreateGameProcedure({ context })),
  ...(await initCreateGameEvent({ context })),
  ...(await initGenerateGameStepperQueuesOnGame({ context })),
});

const initGenerateGameStepperQueuesOnGame = async ({
  context,
}: {
  context: Context;
}) => {
  const generateGameStepperQueueOnGamesQueue = new Queue(
    Queues.generateGameStepperQueueOnGames.name,
    {
      connection,
    }
  );

  const gameStepperQueueOnGameQueue = new Queue(
    Queues.gameStepperQueueOnGame.name,
    { connection }
  );

  const generateGameStepperQueuesOnGameWorker =
    generateGameStepperQueuesOnGameWorkerInit({
      context,
      gameStepperQueueOnGameQueue,
    });

  generateGameStepperQueuesOnGameWorker.isRunning() ||
    (await generateGameStepperQueuesOnGameWorker.run());

  await generateGameStepperQueueOnGamesQueue.add(
    "generateGameStepperQueueOnGames",
    {},
    {
      repeat: Queues.generateGameStepperQueueOnGames.options.repeat,
      delay: 5000,
    }
  );

  const gameStepperQueueOnGameWorker = gameStepperQueueOnGameWorkerInit({
    context,
    gameStepperQueueOnGameQueue,
  });

  gameStepperQueueOnGameWorker.isRunning() ||
    (await gameStepperQueueOnGameWorker.run());

  return {
    generateGameStepperQueueOnGamesQueue,
    gameStepperQueueOnGameQueue,
    gameStepperQueueOnGameWorker,
  };
};

const initCreateGameProcedure = async ({ context }: { context: Context }) => {
  const createGameProcedureQueue = new Queue(Queues.createGameProcedure.name, {
    connection,
  });

  const createGameProcedureWorker = createGameProcedureWorkerInit({ context });

  createGameProcedureWorker.isRunning() ||
    (await createGameProcedureWorker.run());

  return { createGameProcedureQueue, createGameProcedureWorker };
};

const initCreateGameEvent = async ({ context }: { context: Context }) => {
  const createGameEventQueue = new Queue(Queues.createGameEvent.name, {
    connection,
  });

  const createGameEventWorker = createGameEventWorkerInit({ context });

  createGameEventWorker.isRunning() || (await createGameEventWorker.run());

  await createGameEventQueue.add(
    "createGameEventRepeatedly",
    { limit: Queues.createGameEvent.options.limit },
    { repeat: Queues.createGameEvent.options.repeat }
  );

  return { createGameEventQueue, createGameEventWorker };
};

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
