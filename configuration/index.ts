import withAuth from "./auth";
import session from "./session";
import server from "./server";
import { Config } from ".keystone/types";
import db from "./db";
import extendGraphqlSchema from "./extendGraphqlSchema";
import { isAdmin } from "../schema/_misc/accessHelpers";

const configuration: Partial<Config> = {
  session,
  server,
  db,
  extendGraphqlSchema,
  ui: { isAccessAllowed: isAdmin },
};

export { withAuth, configuration };
