import User from "./user";
import Bot from "./Bot";
import Room from "./room";
import { ExportedSchema } from "./_misc/types";
import Game from "./game";
import PlayerBallBind from "./playerBallBind";
import Card from "./card";

export default {
  User,
  Room,
  Bot,
  Game,
  PlayerBallBind,
  Card,
} as ExportedSchema;
