import {
  BaseListTypeInfo,
  ListOperationAccessControl,
} from "@keystone-6/core/types";

const signedIn: ListOperationAccessControl<
  "create" | "query" | "update" | "delete",
  BaseListTypeInfo
> = ({ session }) => !!session;

export const A = {
  signedIn,
};
