import schema from "./list";
import { ExportedExtension } from "../_misc/types";
import gamePlayerProgressQuery from "./extensions/gamePlayerProgressQuery";
import gameBallSetQuery from "./extensions/gameBallSetQuery";

const extension: ExportedExtension = {
  query: {
    gamePlayerProgress: gamePlayerProgressQuery,
    gameBallSet: gameBallSetQuery,
  },
};

export default {
  schema,
  extension,
};
