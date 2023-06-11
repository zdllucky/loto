import { createAuth } from "@keystone-6/auth";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "login",
  sessionData: "createdAt",
  secretField: "password",
  initFirstItem: {
    fields: ["login", "password"],
  },
});

export default withAuth;
