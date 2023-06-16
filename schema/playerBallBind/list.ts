import { list } from "@keystone-6/core";
import { integer, relationship, timestamp } from "@keystone-6/core/fields";
import { hasSession } from "../_misc/accessHelpers";
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
      query: hasSession,
    },
  },
  fields: {
    user: relationship({ ref: "User", many: false, isFilterable: true }),
    bot: relationship({ ref: "Bot", many: false, isFilterable: true }),
    number: integer({
      isFilterable: true,
      isOrderable: true,
      validation: { min: 1, max: 90, isRequired: true },
      isIndexed: "unique",
    }),
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
