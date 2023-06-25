import Alpine from "alpinejs";

export default () => ({
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
      this.playersProgress = chunkArray(
        await Alpine.$repo.games.getGamePlayerProgress(),
        2
      );
    } catch (e) {
      this.playersProgress = [];
    }
  },
});

function chunkArray(array, chunkSize) {
  let results = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }

  return results;
}
