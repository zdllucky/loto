import { timestamp } from "@keystone-6/core/fields";
import { denyAll } from "@keystone-6/core/access";

export const createdAt = timestamp({
  defaultValue: { kind: "now" },
  access: {
    create: denyAll,
    update: denyAll,
  },
  isIndexed: true,
  graphql: {
    omit: { create: true, update: true },
  },
  ui: {
    itemView: { fieldMode: "read", fieldPosition: "sidebar" },
    createView: { fieldMode: "hidden" },
    listView: { fieldMode: "read" },
  },
});
