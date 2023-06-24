import extendExpressApp from "../rest";
import { Config } from ".keystone/types";

const server: Config["server"] = {
  extendExpressApp,
  cors: {
    preflightContinue: false,
    methods: ["GET", "POST"],
    credentials: false,
    origin: "*",
  },
};

export default server;
