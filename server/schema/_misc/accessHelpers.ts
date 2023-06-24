export type Session = {
  itemId: string;
  data: {
    login: string;
    createdAt: Date;
    role: "admin" | "user";
  };
};

export function hasSession({ session }: { session?: Session }) {
  return Boolean(session);
}

export function isAdmin({ session }: { session?: Session }) {
  if (!session) return false;
  return session.data.role === "admin";
}

export function isAdminOrOnlySameUserItem({
  session,
  item,
}: {
  session?: Session;
  item: any;
}) {
  if (!session) return false;
  if (session.data.role === "admin") return true; // unfiltered for admins

  return item.id === session.itemId;
}

export function isAdminOrOnlySameUserFilter({
  session,
}: {
  session?: Session;
}) {
  if (!session) return false;
  if (session.data.role === "admin") return {}; // unfiltered for admins
  return {
    id: { equals: session.itemId },
  };
}
