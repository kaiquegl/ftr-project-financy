import type { Prisma, TransactionType } from "@prisma/client";
import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapTransactionToResponse } from "../transaction.schema";
import {
  normalizeOptionalPeriod,
  normalizePage,
  normalizePerPage,
  resolvePeriodRange
} from "../transaction.validation";

type GetAllTransactionsArgs = {
  filters?: {
    categoryId?: string | null;
    description?: string | null;
    period?: string | null;
    type?: TransactionType | null;
  } | null;
  page?: number | null;
  perPage?: number | null;
};

export const getAllTransactionsQuery = async (
  _: unknown,
  { filters, page, perPage }: GetAllTransactionsArgs,
  context: GraphqlContext
) => {
  const authenticatedUser = requireAuthenticatedUser(context);
  const resolvedPage = normalizePage(page);
  const resolvedPerPage = normalizePerPage(perPage);
  const resolvedPeriod = normalizeOptionalPeriod(filters?.period);

  const where: Prisma.TransactionWhereInput = {
    userId: authenticatedUser.id
  };

  const descriptionFilter = filters?.description?.trim();
  if (descriptionFilter) {
    where.description = {
      contains: descriptionFilter
    };
  }

  if (filters?.type) {
    where.type = filters.type;
  }

  const categoryFilter = filters?.categoryId?.trim();
  if (categoryFilter) {
    where.categoryId = categoryFilter;
  }

  if (resolvedPeriod) {
    const { startDate, endDate } = resolvePeriodRange(resolvedPeriod);
    where.date = {
      gte: startDate,
      lt: endDate
    };
  }

  const skip = (resolvedPage - 1) * resolvedPerPage;
  const [transactions, totalItems] = await context.prisma.$transaction([
    context.prisma.transaction.findMany({
      where,
      include: {
        category: true
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip,
      take: resolvedPerPage
    }),
    context.prisma.transaction.count({
      where
    })
  ]);

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / resolvedPerPage);

  return {
    items: transactions.map((transaction) => mapTransactionToResponse(transaction)),
    page: resolvedPage,
    perPage: resolvedPerPage,
    totalItems,
    totalPages
  };
};
