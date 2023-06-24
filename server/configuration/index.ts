import withAuth from "./auth";
import session from "./session";
import server from "./server";
import { Config } from ".keystone/types";
import db from "./db";
import extendGraphqlSchema from "./extendGraphqlSchema";
import ui from "./ui";
import lists from "../schema";
import { config } from "@keystone-6/core";

const configuration: Config = {
  session,
  server,
  db,
  extendGraphqlSchema,
  ui,
  lists: Object.fromEntries(
    Object.keys(lists).map((key) => [key, lists[key].schema])
  ),
};

export default withAuth(config(configuration));
