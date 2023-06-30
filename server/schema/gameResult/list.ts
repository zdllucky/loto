import { list } from "@keystone-6/core";
import { hasSession } from "../_misc/accessHelpers";
import { denyAll } from "@keystone-6/core/access";
import { integer, relationship, text } from "@keystone-6/core/fields";
import { createdAt } from "../_misc/commonFields";

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
    winnerPlayerLogin: text({}),
    createdAt,
    players: relationship({
      ref: "User",
      many: true,
      isOrderable: true,
      isFilterable: true,
    }),
    gameId: text({
      isIndexed: true,
      defaultValue: "",
      validation: { isRequired: true },
      isFilterable: true,
      isOrderable: true,
    }),
    gameDifficulty: integer({
      validation: { isRequired: true },
      isFilterable: true,
      isOrderable: true,
      defaultValue: 2,
    }),
  },
  ui: {
    itemView: {
      defaultFieldMode: "read",
    },
  },
});

export default schema;
