import { createAuth } from "@keystone-6/auth";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "login",
  sessionData: "login, createdAt, role",
  secretField: "password",
  initFirstItem: {
    fields: ["login", "password"],
    itemData: {
      role: "admin",
    },
    skipKeystoneWelcome: true,
  },
});

export default withAuth;
