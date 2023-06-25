import { list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import { hasSession } from "./_misc/accessHelpers";
import { relationship, select, text } from "@keystone-6/core/fields";

const schema = list({
  fields: {
    login: text({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: "read" } },
      isIndexed: "unique",
    }),
    room: relationship({ ref: "Room.bots", many: false }),
    accuracy: select({
      type: "integer",
      defaultValue: 9800,
      options: [
        // Todo: remove this default value
        { label: "99%", value: 9900 },
        { label: "98%", value: 9800 },
        { label: "90", value: 9000 },
      ],
    }),
    game: relationship({ ref: "Game.bots", many: false }),
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
    labelField: "login",
  },
  graphql: { omit: { create: true, update: true, delete: true } },
});

export default { schema };
