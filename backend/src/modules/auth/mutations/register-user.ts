import { GraphQLError } from "graphql";
import { createSessionToken, hashPassword, setSessionCookie } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapUserToResponse } from "../auth.schema";

type RegisterUserArgs = {
  input: {
    email: string;
    fullName: string;
    password: string;
  };
};

export const registerUserMutation = async (_: unknown, { input }: RegisterUserArgs, context: GraphqlContext) => {
  const existingUser = await context.prisma.user.findUnique({
    where: { email: input.email.toLowerCase() }
  });

  if (existingUser) {
    // Não deixei claro para o usuário o motivo do erro, pois isso pode ser explorado para ataques de força bruta.
    throw new GraphQLError("Não foi possível concluir o cadastro. Tente novamente mais tarde.", {
      extensions: { code: "BAD_USER_INPUT" }
    });
  }

  const hashedPassword = await hashPassword(input.password);
  const createdUser = await context.prisma.user.create({
    data: {
      name: input.fullName,
      email: input.email.toLowerCase(),
      password: hashedPassword
    }
  });

  const sessionToken = await createSessionToken(createdUser.id, 60 * 60 * 24);
  await setSessionCookie(context.request, sessionToken, false);

  return {
    user: mapUserToResponse(createdUser)
  };
};
