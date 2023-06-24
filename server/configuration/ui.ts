import { isAdmin } from "../schema/_misc/accessHelpers";
import { Config } from ".keystone/types";

const ui: Config["ui"] = { isAccessAllowed: isAdmin };

export default ui;
