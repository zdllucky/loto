import { list } from "@keystone-6/core";
import { denyAll, allowAll } from "@keystone-6/core/access";
import { relationship, select, text } from "@keystone-6/core/fields";
import { hasSession, isAdmin } from "../_misc/accessHelpers";
import { createdAt } from "../_misc/commonFields";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: hasSession,
      update: isAdmin,
      delete: isAdmin,
    },
    filter: {
      query: ({ session }) =>
        isAdmin({ session }) ||
        (hasSession({ session }) && {
          OR: [
            { type: { equals: "public" } },
            {
              type: { equals: "private" },
              users: { some: { id: { equals: session.itemId } } },
            },
          ],
        }),
    },
    item: {
      create: ({ inputData, session }) =>
        hasSession({ session }) &&
        ((inputData.type === "private" &&
          typeof inputData.password === "string") ||
          inputData.type === "public"),
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
      defaultValue: 3,
      ui: {
        displayMode: "segmented-control",
        itemView: { fieldPosition: "sidebar", fieldMode: "read" },
      },
    }),
    type: select({
      type: "enum",
      options: [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
      defaultValue: "public",
      ui: {
        displayMode: "segmented-control",
        itemView: { fieldPosition: "sidebar", fieldMode: "read" },
      },
    }),
    password: text({
      ui: {
        itemView: {
          fieldMode: ({ item }) =>
            item.type === "private" ? "edit" : "hidden",
        },
      },
      access: {
        create: allowAll,
        read: ({ session, item }) =>
          isAdmin({ session }) ||
          (hasSession({ session }) && item.ownerId === session.itemId),
        update: denyAll,
      },
    }),
    bots: relationship({
      ref: "Bot.room",
      many: true,
      ui: { labelField: "login" },
    }),
    owner: relationship({
      ref: "User.ownedRoom",
      many: false,
      graphql: { omit: { update: true } },
      isFilterable: true,
    }),
    users: relationship({
      ref: "User.room",
      many: true,
      ui: { labelField: "login" },
    }),
    createdAt,
  },
  hooks: {
    resolveInput: async ({ resolvedData, operation, context }) =>
      operation === "create"
        ? {
            ...resolvedData,
            users: { connect: [{ id: context.session.itemId }] },
            owner: { connect: { id: context.session.itemId } },
            bots: undefined,
          }
        : resolvedData,
  },
  graphql: { omit: { update: true, delete: true } },
});

export default schema;
