import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../category.schema";

type GetCategoryByIdArgs = {
  id: string;
};

export const getCategoryByIdQuery = async (_: unknown, { id }: GetCategoryByIdArgs, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const category = await context.prisma.category.findFirst({
    where: {
      id,
      userId: authenticatedUser.id
    }
  });

  return category ? mapCategoryToResponse(category) : null;
};
