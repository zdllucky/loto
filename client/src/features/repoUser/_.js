import Alpine from "alpinejs";
const getMe = async () => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `query AuthenticatedItem {
        authenticatedItem {
          ... on User {
            createdAt
            login
            room {
              id
            }
            language
            game {
              id
            }
          }
        }
      }`,
    }),
  });

  const { data } = await res.json();

  if (!data.authenticatedItem) {
    throw Error("Not authenticated");
  }

  return data.authenticatedItem;
};

const setLanguage = async ({ language }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    credentials: "include",
    body: JSON.stringify({
      query: `mutation Mutation($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
          updateUser(where: $where, data: $data) {
            language
          }
        }`,
      variables: {
        where: {
          login: Alpine.store("user").login,
        },
        data: {
          language,
        },
      },
    }),
  });

  const { data } = await res.json();

  return data.updateUser.language;
};

Alpine.$repo.user = { getMe, setLanguage };
