import { createTransactionMutation } from "./mutations/create";
import { deleteTransactionMutation } from "./mutations/delete";
import { updateTransactionMutation } from "./mutations/update";
import { getAllTransactionsQuery } from "./queries/get-all";
import { getTransactionByIdQuery } from "./queries/get-by-id";

export const transactionTypeDefs = /* GraphQL */ `
  type Transaction {
    id: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    transactions: [Transaction!]!
    transaction(id: String!): Transaction
  }

  extend type Mutation {
    createTransaction: Transaction!
    updateTransaction(id: String!): Transaction!
    deleteTransaction(id: String!): Boolean!
  }
`;

export const transactionResolvers = {
  Query: {
    transactions: getAllTransactionsQuery,
    transaction: getTransactionByIdQuery
  },
  Mutation: {
    createTransaction: createTransactionMutation,
    updateTransaction: updateTransactionMutation,
    deleteTransaction: deleteTransactionMutation
  }
};
