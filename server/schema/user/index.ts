import schema from "./list";
import type { ExportedExtension } from "../_misc/types";
import registerUserWithLoginAndPasswordMutation from "./extensions/registerUserWithLoginAndPasswordMutation";

const extension: ExportedExtension = {
  mutation: {
    registerUserWithLoginAndPassword: registerUserWithLoginAndPasswordMutation,
  },
};

export default {
  schema,
  extension,
};
