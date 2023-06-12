import { BaseKeystoneTypeInfo, ServerConfig } from "@keystone-6/core/types";
// import { AppConfig, CommonConfig } from "express-zod-api/dist/config-type";
import { logger } from "./logger";
import swaggerUi from "swagger-ui-express";
import { attachRouting, OpenAPI } from "express-zod-api";
import contextProviderGenerate from "./middlewares/express/contextProviderGenerate";
import { Context } from ".keystone/types";
import express, { json, urlencoded } from "express";
import routing from "./router";
import { version, name } from "../package.json";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { connection, Queues } from "../workers/consts";

export let config: any;

const extendExpressApp = (app: express.Express, context: Context) => {
  app.use("/rest", json());
  app.use("/rest", urlencoded({ extended: true }));
  app.use("/rest", contextProviderGenerate(context as Context));

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
    queues: [
      new BullMQAdapter(new Queue(Queues.roomGenerator.name, { connection })),
      new BullMQAdapter(
        new Queue(Queues.roomBotsGenerator.name, { connection })
      ),
      new BullMQAdapter(new Queue(Queues.botsCleanup.name, { connection })),
      new BullMQAdapter(
        new Queue(Queues.fullFakeRoomCleanup.name, { connection })
      ),
    ],
    serverAdapter,
  });

  app.use("/queues", serverAdapter.getRouter());

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
