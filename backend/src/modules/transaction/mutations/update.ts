import type { TransactionType } from "@prisma/client";
import { GraphQLError } from "graphql";
import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapTransactionToResponse } from "../transaction.schema";
import {
  normalizeOptionalTransactionAmount,
  normalizeOptionalTransactionDate,
  normalizeOptionalTransactionDescription
} from "../transaction.validation";

type UpdateTransactionArgs = {
  id: string;
  input: {
    amount?: number;
    categoryId?: string;
    date?: string;
    description?: string;
    type?: TransactionType;
  };
};

export const updateTransactionMutation = async (
  _: unknown,
  { id, input }: UpdateTransactionArgs,
  context: GraphqlContext
) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const transaction = await context.prisma.transaction.findFirst({
    where: {
      id,
      userId: authenticatedUser.id
    }
  });

  if (!transaction) {
    throw new GraphQLError("Transação não encontrada.", {
      extensions: {
        code: "NOT_FOUND"
      }
    });
  }

  const shouldUpdateType = input.type !== undefined;
  const shouldUpdateDescription = input.description !== undefined;
  const shouldUpdateDate = input.date !== undefined;
  const shouldUpdateAmount = input.amount !== undefined;
  const shouldUpdateCategoryId = input.categoryId !== undefined;

  if (
    !(shouldUpdateType || shouldUpdateDescription || shouldUpdateDate || shouldUpdateAmount || shouldUpdateCategoryId)
  ) {
    throw new GraphQLError("Informe pelo menos um campo para atualização.", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  let resolvedCategoryId: string | undefined;
  if (shouldUpdateCategoryId) {
    const trimmedCategoryId = input.categoryId?.trim() ?? "";
    if (!trimmedCategoryId) {
      throw new GraphQLError("Informe uma categoria válida para a transação.", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      });
    }

    const category = await context.prisma.category.findFirst({
      where: {
        id: trimmedCategoryId,
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

    resolvedCategoryId = category.id;
  }

  const updatedTransaction = await context.prisma.transaction.update({
    where: {
      id: transaction.id
    },
    data: {
      type: shouldUpdateType ? input.type : undefined,
      description: normalizeOptionalTransactionDescription(input.description),
      date: normalizeOptionalTransactionDate(input.date),
      amount: normalizeOptionalTransactionAmount(input.amount),
      categoryId: resolvedCategoryId
    },
    include: {
      category: true
    }
  });

  return mapTransactionToResponse(updatedTransaction);
};
