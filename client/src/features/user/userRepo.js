import Alpine from "alpinejs";
export const getMe = async () => {
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query: `query AuthenticatedItem {
        authenticatedItem {
          ... on User {
            createdAt
            login
            room {
              id
            }
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
