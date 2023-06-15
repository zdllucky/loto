import Alpine from "alpinejs";
import { getUserCards } from "./repoCards.js";
import { getGamePlayerProgress } from "./repoGame.js";

Alpine.data("gameCards", () => ({
  cards: undefined,
  init() {
    this.loadCards();
  },
  async loadCards() {
    try {
      this.cards = await getUserCards({ userId: Alpine.store("user").id });
    } catch (e) {
      this.cards = undefined;
    }
  },
}));

Alpine.data("gamePlayerProgress", () => ({
  playersProgress: [],
  refreshIntervalId: undefined,
  init() {
    this.loadProgress();

    this.refreshIntervalId = setInterval(() => this.loadProgress(), 5000);
  },
  destroy() {
    clearInterval(this.refreshIntervalId);
  },
  async loadProgress() {
    try {
      this.playersProgress = chunkArray(await getGamePlayerProgress(), 2);
    } catch (e) {
      this.playersProgress = [];
    }
  },
}));

function chunkArray(array, chunkSize) {
  let results = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }

  return results;
}
