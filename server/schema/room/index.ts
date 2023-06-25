import schema from "./list";
import joinRoomMutation from "./extensions/joinRoomMutation";
import { ExportedExtension } from "../_misc/types";
import exitRoomMutation from "./extensions/exitRoomMutation";
import joinPrivateRoomMutation from "./extensions/joinPrivateRoomMutation";

const extension: ExportedExtension = {
  mutation: {
    joinRoom: joinRoomMutation,
    exitRoom: exitRoomMutation,
    joinPrivateRoom: joinPrivateRoomMutation,
  },
};

export default {
  schema,
  extension,
};
