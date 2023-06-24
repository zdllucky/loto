import { ConnectionOptions } from "bullmq";

export const Queues = {
  roomGenerator: {
    name: "roomGenerator",
    options: {
      amount: {
        min: 5,
        max: 20,
      },
      repeat: { every: 5000 },
    },
  },
  roomBotsGenerator: {
    name: "roomBotsGenerator",
    options: {
      amount: 5,
      addToSubtractProbability: 0.7,
      changeProbability: 0.7,
      repeat: { every: 3000 },
    },
  },
  botsCleanup: {
    name: "botsCleanup",
    options: {
      repeat: { every: 1000 * 60 },
    },
  },
  fullFakeRoomCleanup: {
    name: "fullFakeRoomCleanup",
    options: {
      repeat: { every: 2000 },
    },
  },
  createGameEvent: {
    name: "createGameEvent",
    options: {
      limit: 100,
      repeat: { every: 10000 },
    },
  },
  createGameProcedure: {
    name: "createGameProcedure",
    options: {
      amount: 5,
    },
  },
  generateGameStepperQueueOnGames: {
    name: "generateGameStepperQueueOnGames",
    options: {
      repeat: { every: 5000 },
    },
  },
  gameStepperQueueOnGame: {
    name: "gameStepperQueueOnGame",
    options: {},
  },
  botMoveSimulation: {
    name: "botMoveSimulation",
  },
  finishGameEvent: {
    name: "finishGameEvent",
    options: {
      repeat: { every: 1000 },
    },
  },
  finishGameProcedure: {
    name: "finishGameProcedure",
  },
};

export const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
};
