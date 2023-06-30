import { list } from "@keystone-6/core";
import { integer, relationship, select, json } from "@keystone-6/core/fields";
import { hasSession, isAdmin } from "../_misc/accessHelpers";
import { denyAll } from "@keystone-6/core/access";
import { generateRandomArray } from "./_misc/helpers";
import { createdAt } from "../_misc/commonFields";

const schema = list({
  access: {
    operation: {
      query: hasSession,
      create: denyAll,
      update: isAdmin,
      delete: denyAll,
    },
    filter: {
      query: ({ session }) =>
        isAdmin({ session }) || {
          users: { some: { id: { equals: session?.itemId } } },
        },
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
      defaultValue: 2,
      validation: { isRequired: true },
      ui: {
        displayMode: "segmented-control",
        itemView: { fieldMode: "read" },
        createView: { fieldMode: "hidden" },
        listView: { fieldMode: "read" },
      },
      access: { update: denyAll, create: denyAll },
    }),
    users: relationship({
      ref: "User.game",
      many: true,
    }),
    bots: relationship({ ref: "Bot.game", many: true }),
    gameStatus: select({
      type: "enum",
      defaultValue: "waiting",
      options: [
        { label: "Waiting", value: "waiting" },
        { label: "Playing", value: "playing" },
        { label: "Finished", value: "finished" },
      ],
      access: { create: denyAll },
    }),
    createdAt,
    step: integer({ defaultValue: 0, validation: { isRequired: true } }),
    balls: json({
      defaultValue: [],
      graphql: { omit: { create: true } },
      access: { read: isAdmin },
    }),
    playerBallBinds: relationship({
      ref: "PlayerBallBind.game",
      many: true,
      isOrderable: true,
      isFilterable: true,
      access: { read: isAdmin },
    }),
  },
  hooks: {
    resolveInput: async ({ resolvedData, operation }) => {
      if (operation === "create") {
        resolvedData.balls = generateRandomArray();
      }
      return resolvedData;
    },
  },
});

export default schema;
