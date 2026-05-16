import { GraphQLError } from "graphql";
import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

type DeleteCategoryArgs = {
  id: string;
};

export const deleteCategoryMutation = async (_: unknown, { id }: DeleteCategoryArgs, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const category = await context.prisma.category.findFirst({
    where: {
      id,
      userId: authenticatedUser.id
    }
  });

  if (!category) {
    throw new GraphQLError("Categoria não encontrada.", {
      extensions: {
        code: "NOT_FOUND"
      }
    });
  }

  const transactionsCount = await context.prisma.transaction.count({
    where: {
      categoryId: category.id,
      userId: authenticatedUser.id
    }
  });

  if (transactionsCount > 0) {
    throw new GraphQLError("Não é possível remover uma categoria que possui transações vinculadas.", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  await context.prisma.category.delete({
    where: {
      id: category.id
    }
  });

  return true;
};
