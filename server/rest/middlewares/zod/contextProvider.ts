import { Context } from ".keystone/types";
import { createMiddleware, z } from "express-zod-api";

const contextProvider = createMiddleware({
  input: z.object({}),
  middleware: async ({ response }) => ({
    kCtx: response.locals.kCtx as Context,
  }),
});

export default contextProvider;
