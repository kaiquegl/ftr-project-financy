import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

export const createCategoryMutation = (_: unknown, __: unknown, context: GraphqlContext) => {
  requireAuthenticatedUser(context);
  throw new Error("Not implemented");
};
