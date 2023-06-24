import { timestamp } from "@keystone-6/core/fields";
import { denyAll } from "@keystone-6/core/access";

export const createdAt = timestamp({
  defaultValue: { kind: "now" },
  access: {
    create: denyAll,
    update: denyAll,
  },
  isIndexed: true,
  ui: {
    itemView: { fieldMode: "read" },
    createView: { fieldMode: "hidden" },
    listView: { fieldMode: "read" },
  },
});
