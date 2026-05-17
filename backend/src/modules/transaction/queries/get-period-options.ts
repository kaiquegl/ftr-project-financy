import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

export const getTransactionPeriodsQuery = async (_: unknown, __: unknown, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const transactions = await context.prisma.transaction.findMany({
    where: {
      userId: authenticatedUser.id
    },
    select: {
      date: true
    },
    orderBy: [{ date: "desc" }]
  });

  const uniquePeriods = new Set<string>();

  for (const transaction of transactions) {
    uniquePeriods.add(transaction.date.toISOString().slice(0, 7));
  }

  return [...uniquePeriods];
};
