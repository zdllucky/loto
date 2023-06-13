import schema from "./list";
import joinRoomMutation from "./extensions/joinRoomMutation";
import { ExportedExtension } from "../misc/types";
import exitRoomMutation from "./extensions/exitRoomMutation";

const extension: ExportedExtension = {
  mutation: {
    joinRoom: joinRoomMutation,
    exitRoom: exitRoomMutation,
  },
};

export default {
  schema,
  extension,
};
