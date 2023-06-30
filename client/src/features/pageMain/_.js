import Alpine from "alpinejs";

Alpine.data("leaderboard", () => ({
  rating: "skillRating",
  rankList: { leaders: [], selfRating: {} },
  isLoading: false,
  didFail: false,
  async init() {
    try {
      this.isLoading = true;

      this.rankList = await Alpine.$repo.results.getTotalStatsRating();

      this.didFail = false;
      this.isLoading = false;
    } catch (e) {
      this.didFail = true;

      this.rankList = { leaders: [], selfRating: {} };
    }
  },
  async load(order) {
    const page =
      typeof order === "undefined"
        ? this.rankList.page
        : page
        ? this.rankList.page + 1
        : this.rankList.page - 1;

    try {
      this.isLoading = true;

      this.rankList = await Alpine.$repo.results.getTotalStatsRating({
        page,
      });

      this.didFail = false;
      this.isLoading = false;
    } catch (e) {
      this.didFail = true;

      this.rankList = { leaders: [], selfRating: {} };
    }
  },
}));
