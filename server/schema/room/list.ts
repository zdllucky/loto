import { list } from "@keystone-6/core";
import { allowAll, denyAll } from "@keystone-6/core/access";
import { relationship, select, timestamp } from "@keystone-6/core/fields";
import { hasSession } from "../_misc/accessHelpers";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: denyAll,
      delete: denyAll,
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
    bots: relationship({ ref: "Bot.room", many: true }),
    users: relationship({ ref: "User.room", many: true }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      access: {
        create: denyAll,
        update: denyAll,
        read: allowAll,
      },
    }),
  },
  ui: {
    hideCreate: true,
    listView: { defaultFieldMode: "read" },
    hideDelete: true,
    createView: { defaultFieldMode: "hidden" },
    itemView: { defaultFieldMode: "read" },
  },
  graphql: {
    omit: { create: true, update: true, delete: true },
  },
});

export default schema;
