import { list } from "@keystone-6/core";
import { relationship, select, timestamp } from "@keystone-6/core/fields";
import { allowAll, denyAll } from "@keystone-6/core/access";
import { hasSession, isAdminOrOnlySameUserFilter } from "./misc/accessHelpers";

export const Room = list({
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
    speed: select({
      type: "integer",
      options: [
        { label: "Easy", value: 2 },
        { label: "Common", value: 3 },
        { label: "Hard", value: 4 },
      ],
    }),
    bots: relationship({ ref: "Bot.room", many: true }),
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
