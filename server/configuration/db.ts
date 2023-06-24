import { Config } from ".keystone/types";
import { redis } from "./session";
import initMQService from "../brokers";

const exGeneratorClient = `provider = "prisma-client-js"`;

const generatorClient = `provider = "prisma-client-js"
binaryTargets = ["native", "linux-musl"]`;

const generatorZod = `
generator zod {
  provider                 = "zod-prisma"
  output                   = "./rest/zod"
  relationModel            = true
  modelCase                = "PascalCase"
  modelSuffix              = "Model"
  useDecimalJs             = true
  prismaJsonNullability    = true
}
`;

const db: Config["db"] = {
  provider: "postgresql",
  url:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres?connection_limit=5&pool_timeout=5",
  extendPrismaSchema: (s) =>
    `${s.replace(exGeneratorClient, generatorClient)}${generatorZod}`,
  async onConnect(context) {
    await redis.connect();

    await initMQService({ context });
  },
};

export default db;
