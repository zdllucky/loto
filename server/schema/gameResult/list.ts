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
    winnerBotLogin: text({
      ui: {
        itemView: { fieldMode: "hidden" },
        listView: { fieldMode: "hidden" },
      },
      graphql: { omit: true },
    }),
    winnerPlayerLogin: text({}),
    winnerUser: relationship({
      ref: "User",
      many: false,
      graphql: { omit: true },
      ui: {
        itemView: { fieldMode: "hidden" },
        listView: { fieldMode: "hidden" },
      },
    }),
    createdAt,
    game: relationship({
      ref: "Game.result",
      many: false,
      ui: {
        itemView: { fieldMode: "hidden" },
        listView: { fieldMode: "hidden" },
      },
      graphql: { omit: true },
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
