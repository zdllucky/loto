import extendExpressApp from "../rest";
import { Config } from ".keystone/types";

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ([process.env.FRONTEND_URL, process.env.ADMIN_URL] as string[])
      : ["http://localhost:3333", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

const server: Config["server"] = {
  extendExpressApp,
  cors: {
    preflightContinue: false,
    methods: ["GET", "POST", "OPTIONS", "HEAD"],
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization"],
    // ...corsOptions,
    origin: "*",
  },
};

export default server;
