import lists from "./schema/";
import { config } from "@keystone-6/core";
import { configuration, withAuth } from "./configuration";
import { Config } from ".keystone/types";

export default withAuth(
  config({
    ...configuration,
    lists: Object.fromEntries(
      Object.keys(lists).map((key) => [key, lists[key].schema])
    ),
  } as Config)
);
