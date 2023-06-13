import { list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import { hasSession } from "./misc/accessHelpers";
import { relationship, text } from "@keystone-6/core/fields";

const schema = list({
  fields: {
    login: text({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: "read" } },
      isIndexed: "unique",
    }),
    room: relationship({ ref: "Room.bots", many: false }),
  },
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: denyAll,
      delete: denyAll,
    },
  },
  ui: {
    hideCreate: true,
    listView: { defaultFieldMode: "read" },
    createView: { defaultFieldMode: "hidden" },
    hideDelete: true,
    itemView: { defaultFieldMode: "read" },
  },
  graphql: { omit: { create: true, update: true, delete: true } },
});

export default { schema };
