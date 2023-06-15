import Alpine from "alpinejs";
export const getUserCards = async ({ userId }) => {
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + Alpine.store("auth").token,
    },
    body: JSON.stringify({
      query: `query Cards($where: CardWhereInput!) {
          cards(where: $where) {
            board
            id
          }
        }`,
      variables: {
        where: { user: { id: { equals: userId } } },
      },
    }),
  });

  const { data } = await res.json();

  return data?.cards;
};
