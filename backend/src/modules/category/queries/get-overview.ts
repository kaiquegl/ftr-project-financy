import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../category.schema";

export const getCategoriesOverviewQuery = async (_: unknown, __: unknown, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const [totalCategories, totalTransactions, mostUsedCategoryGroup] = await context.prisma.$transaction([
    context.prisma.category.count({
      where: {
        userId: authenticatedUser.id
      }
    }),
    context.prisma.transaction.count({
      where: {
        userId: authenticatedUser.id
      }
    }),
    context.prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId: authenticatedUser.id
      },
      _count: {
        categoryId: true
      },
      orderBy: {
        _count: {
          categoryId: "desc"
        }
      },
      take: 1
    })
  ]);

  const mostUsedCategoryId = mostUsedCategoryGroup[0]?.categoryId;

  if (!mostUsedCategoryId) {
    return {
      totalCategories,
      totalTransactions,
      mostUsedCategory: null
    };
  }

  const mostUsedCategory = await context.prisma.category.findFirst({
    where: {
      id: mostUsedCategoryId,
      userId: authenticatedUser.id
    }
  });

  return {
    totalCategories,
    totalTransactions,
    mostUsedCategory: mostUsedCategory ? mapCategoryToResponse(mostUsedCategory) : null
  };
};
