import * as ktc from ".keystone/types";
import { redis } from "./session";
import initMQService from "../brokers";
import { Prisma } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import { caching } from "cache-manager";
import { PrismaQueryAction } from "prisma-redis-middleware/dist/types";
import { RedisCache, redisInsStore } from "cache-manager-ioredis-yet";

const exGeneratorClient = `provider = "prisma-client-js"`;

const generatorClient = `provider = "prisma-client-js"
binaryTargets = ["native", "linux-musl"]`;

const generatorZod = `
generator zod {
  provider                 = "zod-prisma"
  output                   = "./server/rest/zod"
  relationModel            = true
  modelCase                = "PascalCase"
  modelSuffix              = "Model"
  useDecimalJs             = true
  prismaJsonNullability    = true
}
`;

const excludeAll: PrismaQueryAction[] = [
  "findFirst",
  "findFirstOrThrow",
  "findUnique",
  "findUniqueOrThrow",
  "findMany",
  "aggregate",
  "count",
  "groupBy",
  "findRaw",
  "runCommandRaw",
  "queryRaw",
  "aggregateRaw",
];

export let redisCache: RedisCache;

const db: ktc.Config["db"] = {
  provider: "postgresql",
  url:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres?connection_limit=5&pool_timeout=5",
  extendPrismaSchema: (s) =>
    `${s.replace(exGeneratorClient, generatorClient)}${generatorZod}`,
  async onConnect(context) {
    const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
      models: [
        {
          model: "GameResult",
          cacheTime: process.env.NODE_ENV === "production" ? 60 * 60 : 60,
          excludeMethods: [],
        },
        {
          model: "User",
          cacheTime: 0,
          invalidateRelated: ["gameResult"],
          excludeMethods: excludeAll,
        },
      ],
      storage: {
        type: "redis",
        options: {
          client: redis,
          invalidation: {
            referencesTTL: process.env.NODE_ENV === "production" ? 60 * 60 : 60,
          },
        },
      },
      onHit: () => process.env.NODE_ENV === "development" && console.log("hit"),
      onMiss: () =>
        process.env.NODE_ENV === "development" && console.log("miss"),
      onDedupe: () =>
        process.env.NODE_ENV === "development" && console.log("dedupe"),
      onError: () =>
        process.env.NODE_ENV === "development" && console.log("error"),
    });

    context.prisma.$use(cacheMiddleware);

    redisCache = await caching(redisInsStore(redis));

    await initMQService({ context });
  },
};

export default db;
