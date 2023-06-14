import { list } from "@keystone-6/core";
import {
  integer,
  relationship,
  select,
  json,
  timestamp,
} from "@keystone-6/core/fields";
import {
  hasSession,
  isAdminOrOnlySameUserFilter,
} from "../_misc/accessHelpers";
import { denyAll } from "@keystone-6/core/access";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: denyAll,
      delete: denyAll,
    },
    filter: {
      query: isAdminOrOnlySameUserFilter,
    },
  },
  fields: {
    user: relationship({ ref: "User", many: false, isFilterable: true }),
    bot: relationship({ ref: "Bot", many: false, isFilterable: true }),
    createdAt: timestamp({ defaultValue: { kind: "now" }, isOrderable: true }),
    game: relationship({
      ref: "Game.playerBallBinds",
      many: false,
      isFilterable: true,
      isOrderable: true,
    }),
  },
});

export default schema;