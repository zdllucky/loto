export const authenticateUserWithPassword = async (login, password) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    body: JSON.stringify({
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
}`,
      variables: { login, password },
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = (await res.json()).data.authenticateUserWithPassword;

  if (data.sessionToken) {
    return data.sessionToken;
  } else throw new Error(data.message ?? "Unknown error");
};

export const registerUserWithLoginAndPassword = async (login, password) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    body: JSON.stringify({
      query: `
        mutation RegisterUserWithLoginAndPassword($login: String!, $password: String!) {
          registerUserWithLoginAndPassword(login: $login, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
              sessionToken
            }
            ... on UserAuthenticationWithPasswordFailure {
              message
            }
          }
        }`,
      variables: { login, password },
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = (await res.json()).data.registerUserWithLoginAndPassword;

  if (data.sessionToken) {
    return data.sessionToken;
  } else throw new Error(data.message ?? "Unknown error");
};
