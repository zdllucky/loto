import Alpine from "alpinejs";
import roomsList from "./globals/roomsList.js";
import selectRoom from "./globals/selectRoom.js";
import createRoom from "./globals/createRoom.js";
import joinPrivateRoom from "./globals/joinPrivateRoom.js";

Alpine.data("roomsList", roomsList);
Alpine.data("selectRoom", selectRoom);
Alpine.data("createRoom", createRoom);
Alpine.data("joinPrivateRoom", joinPrivateRoom);
