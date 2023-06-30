import { Extension } from "../../_misc/types";
import { graphql } from "@keystone-6/core";

const registerUserWithLoginAndPasswordMutation: Extension = (base) =>
  graphql.field({
    type: base.union("UserAuthenticationWithPasswordResult"),
    args: {
      login: graphql.arg({ type: graphql.nonNull(graphql.String) }),
      password: graphql.arg({ type: graphql.nonNull(graphql.String) }),
    },
    async resolve(source, { login, password }, context) {
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
  });

export default registerUserWithLoginAndPasswordMutation;
