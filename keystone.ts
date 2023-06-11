import * as lists from "./schema/";
import { config } from "@keystone-6/core";
import { configuration, withAuth } from "./configuration";
import { Config } from ".keystone/types";

export default withAuth(
  config({
    ...configuration,
    lists,
  } as Config)
);
