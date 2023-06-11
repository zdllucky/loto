import { createAuth } from "@keystone-6/auth";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "login",
  sessionData: "createdAt, role",
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
