import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../../category/category.schema";
import { mapTransactionToResponse } from "../../transaction/transaction.schema";

const FIRST_DAY_OF_MONTH = 1;
const MIDNIGHT_HOUR = 0;
const MIDNIGHT_MINUTE = 0;
const MIDNIGHT_SECOND = 0;
const MIDNIGHT_MILLISECOND = 0;
const TOP_CATEGORIES_LIMIT = 5;
const RECENT_TRANSACTIONS_LIMIT = 5;

type DecimalValue = {
  toNumber: () => number;
};

type AmountByTypeGroup = {
  type: "INCOME" | "EXPENSE";
  _sum: {
    amount: DecimalValue | null;
  };
};

type TopCategoryGroup = {
  categoryId: string;
  _count: {
    categoryId: number;
  };
  _sum: {
    amount: DecimalValue | null;
  };
};

const getMonthDateRange = (referenceDate: Date) => {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();

  const startDate = new Date(
    Date.UTC(year, month, FIRST_DAY_OF_MONTH, MIDNIGHT_HOUR, MIDNIGHT_MINUTE, MIDNIGHT_SECOND, MIDNIGHT_MILLISECOND)
  );
  const endDate = new Date(
    Date.UTC(year, month + 1, FIRST_DAY_OF_MONTH, MIDNIGHT_HOUR, MIDNIGHT_MINUTE, MIDNIGHT_SECOND, MIDNIGHT_MILLISECOND)
  );

  return {
    startDate,
    endDate
  };
};

const getAmountByType = (groups: AmountByTypeGroup[], targetType: "INCOME" | "EXPENSE") => {
  const amount = groups.find((group) => group.type === targetType)?._sum.amount;

  if (!amount) {
    return 0;
  }

  return amount.toNumber();
};

export const getDashboardQuery = async (_: unknown, __: unknown, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);
  const { startDate, endDate } = getMonthDateRange(new Date());

  const [historicalTotals, currentMonthTotals, recentTransactions, topCategoriesGrouped] =
    await context.prisma.$transaction([
      context.prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId: authenticatedUser.id
        },
        orderBy: {
          type: "asc"
        },
        _sum: {
          amount: true
        }
      }),
      context.prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId: authenticatedUser.id,
          date: {
            gte: startDate,
            lt: endDate
          }
        },
        orderBy: {
          type: "asc"
        },
        _sum: {
          amount: true
        }
      }),
      context.prisma.transaction.findMany({
        where: {
          userId: authenticatedUser.id
        },
        include: {
          category: true
        },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: RECENT_TRANSACTIONS_LIMIT
      }),
      context.prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId: authenticatedUser.id
        },
        _count: {
          categoryId: true
        },
        _sum: {
          amount: true
        },
        orderBy: {
          _count: {
            categoryId: "desc"
          }
        },
        take: TOP_CATEGORIES_LIMIT
      })
    ]);

  const historicalIncome = getAmountByType(historicalTotals as AmountByTypeGroup[], "INCOME");
  const historicalExpense = getAmountByType(historicalTotals as AmountByTypeGroup[], "EXPENSE");
  const currentMonthIncome = getAmountByType(currentMonthTotals as AmountByTypeGroup[], "INCOME");
  const currentMonthExpense = getAmountByType(currentMonthTotals as AmountByTypeGroup[], "EXPENSE");

  const topCategoryIds = (topCategoriesGrouped as TopCategoryGroup[]).map((group) => group.categoryId);
  const topCategories = topCategoryIds.length
    ? await context.prisma.category.findMany({
        where: {
          userId: authenticatedUser.id,
          id: {
            in: topCategoryIds
          }
        }
      })
    : [];

  const topCategoriesById = new Map(topCategories.map((category) => [category.id, category]));

  return {
    totalBalance: historicalIncome - historicalExpense,
    currentMonthIncome,
    currentMonthExpense,
    recentTransactions: recentTransactions.map((transaction) => mapTransactionToResponse(transaction)),
    topCategories: (topCategoriesGrouped as TopCategoryGroup[])
      .map((group) => {
        const category = topCategoriesById.get(group.categoryId);

        if (!category) {
          return null;
        }

        return {
          category: mapCategoryToResponse(category),
          transactionsCount: group._count.categoryId,
          amountTotal: group._sum.amount?.toNumber() ?? 0
        };
      })
      .filter((categorySummary) => categorySummary !== null)
  };
};
