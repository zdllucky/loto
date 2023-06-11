import withAuth from "./auth";
import session from "./session";
import server from "./server";
import { Config } from ".keystone/types";
import db from "./db";

const configuration: Partial<Config> = { session, server, db };

export { withAuth, configuration };
