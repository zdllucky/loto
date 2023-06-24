import { graphql } from "@keystone-6/core";
import { Config } from ".keystone/types";
import schema from "../schema";
import { Extension } from "@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema";

// noinspection TypeScriptValidateJSTypes
const extendGraphqlSchema: Config["extendGraphqlSchema"] = graphql.extend(
  (base) => {
    return Object.entries(schema).reduce(
      (acc, [, value]) => {
        if (value.extension) {
          value.extension.mutation &&
            Object.entries(value.extension.mutation).forEach(
              ([mutationKey, mutationValue]) =>
                (acc.mutation![mutationKey] = mutationValue(base))
            );

          value.extension.query &&
            Object.entries(value.extension.query).forEach(
              ([queryKey, queryValue]) =>
                (acc.query![queryKey] = queryValue(base))
            );
        }

        return acc;
      },
      {
        mutation: {},
        query: {},
      } as Extension
    );
  }
);

export default extendGraphqlSchema;
