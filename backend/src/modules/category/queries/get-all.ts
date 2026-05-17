import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../category.schema";

type GetAllCategoriesArgs = {
  onlyWithTransactions?: boolean | null;
};

export const getAllCategoriesQuery = async (
  _: unknown,
  { onlyWithTransactions }: GetAllCategoriesArgs,
  context: GraphqlContext
) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const categories = await context.prisma.category.findMany({
    where: {
      userId: authenticatedUser.id,
      ...(onlyWithTransactions ? { transactions: { some: {} } } : {})
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
