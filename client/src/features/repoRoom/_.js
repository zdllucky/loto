import Alpine from "alpinejs";
const getRooms = async ({ amount = 10 }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
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

const selectRoom = async ({ roomId }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query: `mutation Mutation($roomId: ID!) {
        joinRoom(roomId: $roomId) {
          __typename
          ... on JoinRoomFailure {
            message
          }
          ... on JoinRoomSuccess {
            roomId
          }
        }
      }`,
      variables: {
        roomId,
      },
    }),
  });

  const { data } = await res.json();

  if (data.joinRoom.__typename === "JoinRoomFailure") {
    throw new Error(data.joinRoom.message);
  }
};

const exitRoom = async () => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query: `mutation ExitRoom {
        exitRoom {
          __typename
          ... on ExitRoomSuccess {
            ok
          }
          ... on ExitRoomFailure {
            message
          }
        }
      }`,
      variables: {},
    }),
  });

  const { data } = await res.json();

  if (data.exitRoom.__typename === "ExitRoomFailure") {
    throw new Error(data.exitRoom.message);
  }
};

const getRoom = async ({ roomId }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query: `
      query Room($where: RoomWhereUniqueInput!) {
        room(where: $where) {
          bots {
            id
            login
          }
          id
          speed
          type
          owner {
            login
          }
          password
          createdAt
          users {
            id
            login
          }
        }
      }`,
      variables: {
        where: {
          id: roomId,
        },
      },
    }),
  });
  const { data } = await res.json();

  return {
    ...data.room,
    bots: undefined,
    users: [...data.room.users, ...data.room.bots],
  };
};

const createRoom = async ({ speed, password, type }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query: `mutation createRoom($data: RoomCreateInput!) {
        createRoom(data: $data) {
          id
        }
      }`,

      variables: {
        data: {
          speed,
          password,
          type,
        },
      },
    }),
  });

  const { data } = await res.json();

  if (!data.createRoom) {
    throw new Error(data.createRoom?.errors?.message || "Can't create room");
  }

  return data.createRoom;
};

const joinPrivateRoom = async ({ roomId, password }) => {
  const res = await fetch(import.meta.env.VITE_BASE_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Alpine.store("auth").token}`,
    },
    body: JSON.stringify({
      query: `mutation JoinPrivateRoom($roomId: ID!, $password: String!) {
          joinPrivateRoom(roomId: $roomId, password: $password) {
            success
            message
          }
        }`,
      variables: {
        roomId,
        password,
      },
    }),
  });

  const { data } = await res.json();

  if (!data.joinPrivateRoom.success) {
    throw new Error(data.joinPrivateRoom.message);
  }

  return data.joinPrivateRoom;
};

Alpine.$repo.rooms = {
  getRooms,
  selectRoom,
  getRoom,
  exitRoom,
  createRoom,
  joinPrivateRoom,
};
