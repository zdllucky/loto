import schema from "./list";
import { ExportedExtension } from "../_misc/types";
import personalStatsRatingQuery from "./extensinons/personalStatsRatingQuery";
import totalStatsRatingQuery from "./extensinons/totalStatsRatingQuery";

const extension: ExportedExtension = {
  query: {
    personalStatsRating: personalStatsRatingQuery,
    totalStatsRating: totalStatsRatingQuery,
  },
};

export default {
  schema,
  extension,
};
