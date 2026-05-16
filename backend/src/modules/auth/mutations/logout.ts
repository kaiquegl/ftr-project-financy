import { clearSessionCookie } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

export const logoutMutation = async (_: unknown, __: unknown, context: GraphqlContext) => {
  await clearSessionCookie(context.request);
  return true;
};
