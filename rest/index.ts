import { logger } from "./logger";
import { attachRouting } from "express-zod-api";
import contextProviderGenerate from "./middlewares/express/contextProviderGenerate";
import { Context } from ".keystone/types";
import express, { json, urlencoded } from "express";
import routing from "./router";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { connection, Queues } from "../brokers/consts";

export let config: any;

const extendExpressApp = (app: express.Express, context: Context) => {
  app.use("/api/rest", json());
  app.use("/api/rest", urlencoded({ extended: true }));
  app.use("/api/rest", contextProviderGenerate(context as Context));

  config = {
    app,
    cors: false,
    logger,
    startupLogo: false,
  };

  const { notFoundHandler } = attachRouting(config, routing);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/queues");

  createBullBoard({
    queues: Object.values(Queues).map(
      (queue) => new BullMQAdapter(new Queue(queue.name, { connection }))
    ),
    serverAdapter,
  });

  app.use(
    "/queues",
    async (req, res, next) =>
      !(await context.withRequest(req, res)).session?.itemId
        ? res.redirect("/signin")
        : next(),
    serverAdapter.getRouter()
  );

  //   app.use(
  //     "/api/rest/docs",
  //     swaggerUi.serve,
  //     swaggerUi.setup(
  //       new OpenAPI({
  //         routing, // the same routing and config that you use to start the server
  //         config,
  //         version,
  //         title: name,
  //         serverUrl: "http://localhost:3000/",
  //       }).getSpec(),
  //       {
  //         explorer: true,
  //       }
  //     )
  //   );
  app.use("/rest", notFoundHandler);
};

export default extendExpressApp;
