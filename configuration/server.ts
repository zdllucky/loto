import extendExpressApp from "../rest";
import { Config } from ".keystone/types";

const server: Config["server"] = { extendExpressApp };

export default server;
