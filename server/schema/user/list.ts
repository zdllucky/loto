import { list } from "@keystone-6/core";
import { allowAll, denyAll } from "@keystone-6/core/access";
import { password, relationship, select, text } from "@keystone-6/core/fields";
import { hasSession, isAdmin } from "../_misc/accessHelpers";
import { createdAt } from "../_misc/commonFields";

const schema = list({
  ui: { labelField: "login" },
  access: {
    operation: {
      query: hasSession,
      create: ({ session }) => !session || isAdmin({ session }),
      update: isAdmin,
      delete: isAdmin,
    },
    filter: {
      query: ({ session }) =>
        isAdmin({ session }) || {
          OR: [
            { id: { equals: session?.itemId } },
            { game: { users: { some: { id: { equals: session?.itemId } } } } },
            { room: { users: { some: { id: { equals: session?.itemId } } } } },
          ],
        },
    },
  },
  fields: {
    login: text({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: "read" } },
      isIndexed: "unique",
      access: {
        create: allowAll,
        read: allowAll,
        update: denyAll,
      },
    }),
    role: select({
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
      type: "enum",
      defaultValue: "user",
      validation: { isRequired: true },
      access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
    }),
    room: relationship({ ref: "Room.users", many: false, isFilterable: true }),
    game: relationship({ ref: "Game.users", many: false, isFilterable: true }),
    password: password({
      validation: { isRequired: true },
      access: {
        create: allowAll,
        read: isAdmin,
        update: isAdmin,
      },
    }),
    createdAt,
  },
});

export default schema;
