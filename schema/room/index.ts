import schema from "./list";
import joinRoomMutation from "./extensions/joinRoomMutation";
import { ExportedExtension } from "../misc/types";

const extension: ExportedExtension = {
  mutation: {
    joinRoom: joinRoomMutation,
  },
};

export default {
  schema,
  extension,
};
