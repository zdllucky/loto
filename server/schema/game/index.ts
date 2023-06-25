import schema from "./list";
import { ExportedExtension } from "../_misc/types";
import gamePlayerProgressQuery from "./extensions/gamePlayerProgressQuery";
import gameBallSetQuery from "./extensions/gameBallSetQuery";
import exitGameMutation from "./extensions/exitGameMutation";
import startGameMutation from "./extensions/startGameMutation";

const extension: ExportedExtension = {
  query: {
    gamePlayerProgress: gamePlayerProgressQuery,
    gameBallSet: gameBallSetQuery,
  },
  mutation: {
    exitGame: exitGameMutation,
    startGame: startGameMutation,
  },
};

export default {
  schema,
  extension,
};
