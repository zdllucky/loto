import { DependsOnMethod, Routing } from "express-zod-api";
import * as version from "./version";

const d = (r: typeof DependsOnMethod.constructor.arguments) =>
  new DependsOnMethod(r);

const routing: Routing = {
  rest: {
    version: d(version),
  },
};

export default routing;
