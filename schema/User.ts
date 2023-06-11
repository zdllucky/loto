import { list } from "@keystone-6/core";
import { denyAll } from "@keystone-6/core/access";
import { password, text, timestamp } from "@keystone-6/core/fields";

export const User = list({
  access: denyAll,
  ui: {
    isHidden: true,
  },
  fields: {
    login: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    password: password({ validation: { isRequired: true } }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
    }),
  },
});
