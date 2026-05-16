import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapUserToResponse } from "../auth.schema";

export const getMeQuery = (_: unknown, __: unknown, context: GraphqlContext) => {
  const user = requireAuthenticatedUser(context);
  return mapUserToResponse(user);
};
