import { Context } from ".keystone/types";
import { RequestHandler } from "express";

const contextProviderGenerate =
  (ctx: Context): RequestHandler =>
  (req, res, next) => {
    res.locals.kCtx = ctx;

    next();
  };

export default contextProviderGenerate;
