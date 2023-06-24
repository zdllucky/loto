import { list } from "@keystone-6/core";
import { integer, relationship } from "@keystone-6/core/fields";
import { isAdmin } from "../_misc/accessHelpers";
import { denyAll } from "@keystone-6/core/access";
import { createdAt } from "../_misc/commonFields";

const schema = list({
  access: {
    operation: {
      query: isAdmin,
      create: denyAll,
      update: denyAll,
      delete: denyAll,
    },
    filter: {
      query: isAdmin,
    },
  },
  fields: {
    user: relationship({ ref: "User", many: false, isFilterable: true }),
    bot: relationship({ ref: "Bot", many: false, isFilterable: true }),
    number: integer({
      isFilterable: true,
      isOrderable: true,
      validation: { min: 1, max: 90, isRequired: true },
      isIndexed: true,
    }),
    card: relationship({ ref: "Card", many: false, isFilterable: true }),
    createdAt,
    game: relationship({
      ref: "Game.playerBallBinds",
      many: false,
      isFilterable: true,
      isOrderable: true,
    }),
  },
});

export default schema;
