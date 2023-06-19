import { list } from "@keystone-6/core";
import { hasSession } from "../_misc/accessHelpers";
import { denyAll } from "@keystone-6/core/access";
import { relationship, text, timestamp } from "@keystone-6/core/fields";

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
    createdAt: timestamp({ defaultValue: { kind: "now" } }),
    game: relationship({ ref: "Game.result", many: false }),
  },
});

export default schema;
