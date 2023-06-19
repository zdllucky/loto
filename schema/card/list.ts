import { list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import { hasSession } from "../_misc/accessHelpers";
import { json, relationship } from "@keystone-6/core/fields";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: denyAll,
      delete: denyAll,
    },
    filter: {
      query: ({ session }) => ({
        user: { some: { id: { equals: session?.itemId } } },
      }),
    },
  },
  fields: {
    game: relationship({ ref: "Game", many: false, isFilterable: true }),
    user: relationship({ ref: "User", many: false, isFilterable: true }),
    bot: relationship({ ref: "Bot", many: false, isFilterable: true }),
    numbers: json(),
    board: json(),
  },
  hooks: {
    validateInput: async ({ resolvedData, addValidationError, operation }) => {
      if (operation === "create") {
        const { board, numbers } = resolvedData;
        if (board || numbers) {
          addValidationError("card data is required");
        }
      }
    },
  },
});

export default schema;
