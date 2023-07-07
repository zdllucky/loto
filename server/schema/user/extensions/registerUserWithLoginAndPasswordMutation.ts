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

      if (login.length < 5 || login.length > 32)
        return {
          __typename: "UserAuthenticationWithPasswordFailure",
          message: "server.user.wrongLoginLength",
        };

      if (new RegExp(/[^a-zA-Z0-9_]/).test(login))
        return {
          __typename: "UserAuthenticationWithPasswordFailure",
          message: "server.user.wrongLoginChars",
        };

      if (password.length < 8 || password.length > 32)
        return {
          __typename: "UserAuthenticationWithPasswordFailure",
          message: "server.user.wrongPasswordLength",
        };

      if (
        await sudoContext.prisma.user.findUnique({
          where: { login },
        })
      )
        return {
          __typename: "UserAuthenticationWithPasswordFailure",
          message: "server.user.loginTaken",
        };

      try {
        await sudoContext.query.User.createOne({
          data: { login, password },
        });
      } catch (e: any) {
        return {
          __typename: "UserAuthenticationWithPasswordFailure",
          message: "server.user.failedToRegister",
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
