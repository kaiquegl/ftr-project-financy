import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../category.schema";

export const getAllCategoriesQuery = async (_: unknown, __: unknown, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const categories = await context.prisma.category.findMany({
    where: {
      userId: authenticatedUser.id
    },
    include: {
      _count: {
        select: {
          transactions: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return categories.map((category) => mapCategoryToResponse(category));
};
