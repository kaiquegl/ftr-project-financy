import { GraphQLError } from "graphql";
import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";

type DeleteTransactionArgs = {
  id: string;
};

export const deleteTransactionMutation = async (_: unknown, { id }: DeleteTransactionArgs, context: GraphqlContext) => {
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

  await context.prisma.transaction.delete({
    where: {
      id: transaction.id
    }
  });

  return true;
};
