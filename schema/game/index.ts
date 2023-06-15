import schema from "./list";
import { ExportedExtension } from "../_misc/types";
import gamePlayerProgressQuery from "./extensions/gamePlayerProgressQuery";

const extension: ExportedExtension = {
  query: {
    gamePlayerProgress: gamePlayerProgressQuery,
  },
};

export default {
  schema,
  extension,
};
