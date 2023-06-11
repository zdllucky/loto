import { Config } from ".keystone/types";

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
  provider: "sqlite",
  url: "file:./keystone.db",
  extendPrismaSchema: (s) => `${s}${generatorZod}`,
};

export default db;
