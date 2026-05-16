import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

export const getAllCategoriesQuery = (_: unknown, __: unknown, context: GraphqlContext) => {
  requireAuthenticatedUser(context);
  return [];
};
