import { graphql, list } from "@keystone-6/core";
import { allowAll, denyAll } from "@keystone-6/core/access";
import { BaseSchemaMeta } from "@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema";
import { Context } from ".keystone/types";
import {
  password,
  relationship,
  select,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import {
  hasSession,
  isAdmin,
  isAdminOrOnlySameUserFilter,
} from "./misc/accessHelpers";
import { ExportedSchema } from "./misc/types";

const schema = list({
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
    room: relationship({ ref: "Room.users", many: false }),
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

const extension = {
  mutation: {
    registerUserWithLoginAndPassword: (base: BaseSchemaMeta) =>
      graphql.field({
        type: base.union("UserAuthenticationWithPasswordResult"),
        args: {
          login: graphql.arg({ type: graphql.nonNull(graphql.String) }),
          password: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(source, { login, password }, context: Context) {
          const sudoContext = context.sudo();

          try {
            await sudoContext.query.User.createOne({
              data: { login, password },
            });
          } catch (e: any) {
            return {
              message: e?.message ?? "Undefined error",
            };
          }
          const res = await context.graphql.run({
            query: `
              mutation AuthenticateUserWithPassword($login: String!, $password: String!) {
                authenticateUserWithPassword(login: $login, password: $password) {
                  ... on UserAuthenticationWithPasswordSuccess {
                    sessionToken
                  }
                  ... on UserAuthenticationWithPasswordFailure {
                    message
                  }
                }
              }
            `,
            variables: {
              login,
              password,
            },
          });

          return (res as any).authenticateUserWithPassword;
        },
      }),
  },
};

export default {
  schema,
  extension,
};
