import { Lists } from ".keystone/types";
import { BaseSchemaMeta } from "@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema";
import { Field, OutputType } from "@graphql-ts/schema";

export type ExportedSchema = Record<
  string,
  {
    schema: Lists["lists"];
    extension?: ExportedExtension;
  }
>;

export type ExportedExtension = {
  mutation?: Record<
    string,
    (
      schema: BaseSchemaMeta
    ) => Field<unknown, any, OutputType<any>, string, any>
  >;
  query?: (
    schema: BaseSchemaMeta
  ) => Field<unknown, any, OutputType<any>, string, any>;
};
