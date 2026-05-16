import { GraphQLError } from "graphql";
import { createSessionToken, setSessionCookie, verifyPassword } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { type LoginArgs, mapUserToResponse } from "../auth.schema";

export const loginMutation = async (_: unknown, args: LoginArgs, context: GraphqlContext) => {
  const existingUser = await context.prisma.user.findUnique({
    where: { email: args.email.toLowerCase() }
  });

  if (!existingUser) {
    throw new GraphQLError("E-mail ou senha inválidos", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }

  const isPasswordValid = await verifyPassword(args.password, existingUser.password);
  if (!isPasswordValid) {
    throw new GraphQLError("E-mail ou senha inválidos", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }

  const sessionToken = await createSessionToken(existingUser.id, args.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24);
  await setSessionCookie(context.request, sessionToken, args.rememberMe);

  return {
    user: mapUserToResponse(existingUser)
  };
};
