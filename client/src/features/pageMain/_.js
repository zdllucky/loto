import Alpine from "alpinejs";

const initialRankList = { skillRating: [], winRating: [], selfRating: {} };

Alpine.data("leaderboard", () => ({
  rating: "skillRating",
  rankList: initialRankList,
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

      this.rankList = initialRankList;
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

      this.rankList = { initialRankList, page: this.rankList.page };
    }
  },
}));
