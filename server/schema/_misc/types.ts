import { Lists } from ".keystone/types";
import { BaseSchemaMeta } from "@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema";
import type { Field, OutputType } from "@graphql-ts/schema";

export type ExportedSchema = Record<
  string,
  {
    schema: Lists["lists"];
    extension?: ExportedExtension;
  }
>;

export type Extension = (
  schema: BaseSchemaMeta
) => Field<unknown, any, OutputType<any>, string, any>;

export type ExportedExtension = {
  mutation?: Record<string, Extension>;
  query?: Record<string, Extension>;
};
