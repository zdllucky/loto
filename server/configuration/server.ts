import extendExpressApp from "../rest";
import { Config } from ".keystone/types";

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:3333",
  optionsSuccessStatus: 200,
};

const server: Config["server"] = {
  extendExpressApp,
  cors: {
    preflightContinue: false,
    methods: ["GET", "POST"],
    credentials: false,
    ...corsOptions,
  },
};

export default server;
