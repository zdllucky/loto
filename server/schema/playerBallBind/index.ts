import schema from "./list";
import { ExportedExtension } from "../_misc/types";
import selectBallMutation from "./extensions/selectBallMutation";
import selectedBallsOnCardsQuery from "./extensions/selectedBallsOnCardsQuery";

const extension: ExportedExtension = {
  mutation: {
    selectBall: selectBallMutation,
  },
  query: {
    selectedBalls: selectedBallsOnCardsQuery,
  },
};

export default {
  schema,
  extension,
};
