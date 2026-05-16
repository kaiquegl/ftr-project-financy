import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapUserToResponse } from "../auth.schema";

type UpdateUserArgs = {
  input: {
    fullName: string;
  };
};

export const updateUserMutation = async (_: unknown, { input }: UpdateUserArgs, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const updatedUser = await context.prisma.user.update({
    where: { id: authenticatedUser.id },
    data: {
      name: input.fullName
    }
  });

  return {
    user: mapUserToResponse(updatedUser)
  };
};
