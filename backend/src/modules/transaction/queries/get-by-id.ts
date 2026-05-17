import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapTransactionToResponse } from "../transaction.schema";

type GetTransactionByIdArgs = {
  id: string;
};

export const getTransactionByIdQuery = async (_: unknown, { id }: GetTransactionByIdArgs, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const transaction = await context.prisma.transaction.findFirst({
    where: {
      id,
      userId: authenticatedUser.id
    },
    include: {
      category: true
    }
  });

  return transaction ? mapTransactionToResponse(transaction) : null;
};
