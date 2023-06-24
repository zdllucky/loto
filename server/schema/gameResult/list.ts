import { list } from "@keystone-6/core";
import { hasSession } from "../_misc/accessHelpers";
import { denyAll } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";
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
    winnerBotLogin: text({}),
    winnerUser: relationship({ ref: "User", many: false }),
    createdAt,
    game: relationship({ ref: "Game.result", many: false }),
  },
});

export default schema;
