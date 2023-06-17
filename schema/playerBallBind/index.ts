import schema from "./list";
import { ExportedExtension } from "../_misc/types";
import selectBallMutation from "./extensions/selectBallMutation";

const extension: ExportedExtension = {
  mutation: {
    selectBall: selectBallMutation,
  },
};

export default {
  schema,
  extension,
};
