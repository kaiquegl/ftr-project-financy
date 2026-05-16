import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

export const getAllTransactionsQuery = (_: unknown, __: unknown, context: GraphqlContext) => {
  requireAuthenticatedUser(context);
  return [];
};
