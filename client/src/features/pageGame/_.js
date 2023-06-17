import Alpine from "alpinejs";
import gameCards from "./globals/gameCards.js";
import gamePlayerProgress from "./globals/gamePlayerProgress.js";
import gameBalls from "./globals/gameBalls.js";
import gameSelectedBalls from "./globals/gameSelectedBalls.js";
import gameCardCell from "./globals/gameCardCell.js";

Alpine.data("gameCards", gameCards);
Alpine.data("gamePlayerProgress", gamePlayerProgress);
Alpine.data("gameBalls", gameBalls);
Alpine.bind("gameCardCell", gameCardCell);
Alpine.data("gameSelectedBalls", gameSelectedBalls);
