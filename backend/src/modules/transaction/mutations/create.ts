import type { TransactionType } from "@prisma/client";
import { GraphQLError } from "graphql";
import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapTransactionToResponse } from "../transaction.schema";
import {
  normalizeTransactionAmount,
  normalizeTransactionDate,
  normalizeTransactionDescription
} from "../transaction.validation";

type CreateTransactionArgs = {
  input: {
    amount: number;
    categoryId: string;
    date: string;
    description: string;
    type: TransactionType;
  };
};

export const createTransactionMutation = async (
  _: unknown,
  { input }: CreateTransactionArgs,
  context: GraphqlContext
) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const categoryId = input.categoryId.trim();
  if (!categoryId) {
    throw new GraphQLError("Informe uma categoria para a transação.", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  const category = await context.prisma.category.findFirst({
    where: {
      id: categoryId,
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

  const createdTransaction = await context.prisma.transaction.create({
    data: {
      type: input.type,
      description: normalizeTransactionDescription(input.description),
      date: normalizeTransactionDate(input.date),
      amount: normalizeTransactionAmount(input.amount),
      categoryId: category.id,
      userId: authenticatedUser.id
    },
    include: {
      category: true
    }
  });

  return mapTransactionToResponse(createdTransaction);
};
