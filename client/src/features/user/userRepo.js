import Alpine from "alpinejs";
export const getMe = async () => {
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query:
        "query AuthenticatedItem {\n  authenticatedItem {\n    ... on User {\n      createdAt\n      login\n      room {\n        id\n      }\n    }\n  }\n}",
    }),
  });

  const { data } = await res.json();

  if (!data.authenticatedItem) {
    throw Error("Not authenticated");
  }

  return data.authenticatedItem;
};
