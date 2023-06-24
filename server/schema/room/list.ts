import { list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import { relationship, select } from "@keystone-6/core/fields";
import { hasSession, isAdmin } from "../_misc/accessHelpers";
import { createdAt } from "../_misc/commonFields";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: isAdmin,
      delete: isAdmin,
    },
  },
  fields: {
    speed: select({
      type: "integer",
      options: [
        { label: "Easy", value: 2 },
        { label: "Common", value: 3 },
        { label: "Hard", value: 4 },
      ],
    }),
    bots: relationship({
      ref: "Bot.room",
      many: true,
      ui: {
        labelField: "login",
      },
    }),
    users: relationship({
      ref: "User.room",
      many: true,
      ui: {
        labelField: "login",
      },
    }),
    createdAt,
  },
  graphql: {
    omit: { create: true, update: true, delete: true },
  },
});

export default schema;
