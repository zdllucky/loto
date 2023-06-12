import { Config } from ".keystone/types";
import { redis } from "./session";
import initMQService from "../workers";

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
  url: "postgres://postgres:postgres@localhost:5432/postgres",
  extendPrismaSchema: (s) => `${s}${generatorZod}`,
  async onConnect(context) {
    await redis.connect();

    await initMQService({ context });
  },
};

export default db;
