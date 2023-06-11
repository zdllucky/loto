import { list } from "@keystone-6/core";
import { allowAll, denyAll } from "@keystone-6/core/access";
import { password, select, text, timestamp } from "@keystone-6/core/fields";
import {
  hasSession,
  isAdmin,
  isAdminOrOnlySameUserFilter,
  isAdminOrOnlySameUserItem,
} from "./misc/accessHelpers";

export const User = list({
  access: {
    operation: {
      query: hasSession,
      create: ({ session }) => !session || isAdmin(session),
      update: isAdmin,
      delete: isAdmin,
    },
    filter: {
      query: isAdminOrOnlySameUserFilter,
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
        create: denyAll,
        read: allowAll,
        update: isAdmin,
      },
    }),
    password: password({
      validation: { isRequired: true },
      access: {
        create: allowAll,
        read: isAdmin,
        update: isAdmin,
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      access: {
        create: denyAll,
        update: denyAll,
        read: allowAll,
      },
    }),
  },
});
