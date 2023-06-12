import Alpine from "alpinejs";
export const getRooms = async ({ amount = 10 }) => {
  const res = await fetch("http://localhost:3000/api/graphql", {
    body: JSON.stringify({
      query: `
        query Rooms($orderBy: [RoomOrderByInput!]!, $take: Int) {
          rooms(orderBy: $orderBy, take: $take) {
            id
            speed
            botsCount
          }
        }`,
      variables: { take: amount, orderBy: [{ createdAt: "asc" }] },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    method: "POST",
  });

  const { data } = await res.json();

  return data.rooms;
};
