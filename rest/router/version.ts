import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { version } from "../../package.json";

export const get = defaultEndpointsFactory.build({
  method: "get",
  input: z.object({}),
  output: z.object({ version: z.string() }),
  handler: async () => ({ version }),
});
