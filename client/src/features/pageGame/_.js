import Alpine from "alpinejs";
import { getUserCards } from "./repoCards.js";
import { getGamePlayerProgress } from "./repoGame.js";

Alpine.data("gameCards", () => ({
  cards: [],
  init() {
    const intervalId = setInterval(() => {
      if (Alpine.store("user")?.login) {
        clearInterval(intervalId);
        this.loadCards();
      }
    }, 10);
  },
  async loadCards() {
    try {
      this.cards = await getUserCards({ login: Alpine.store("user").login });
    } catch (e) {
      this.cards = [];
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
