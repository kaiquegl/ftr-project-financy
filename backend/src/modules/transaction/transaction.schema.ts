import { mapCategoryToResponse } from "../category/category.schema";
import { createTransactionMutation } from "./mutations/create";
import { deleteTransactionMutation } from "./mutations/delete";
import { updateTransactionMutation } from "./mutations/update";
import { getAllTransactionsQuery } from "./queries/get-all";
import { getTransactionByIdQuery } from "./queries/get-by-id";

type CategoryEntity = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

type TransactionEntity = {
  id: string;
  type: "EXPENSE" | "INCOME";
  description: string;
  date: Date;
  amount: { toNumber: () => number };
  categoryId: string;
  category: CategoryEntity;
  createdAt: Date;
  updatedAt: Date;
};

export function mapTransactionToResponse(transaction: TransactionEntity) {
  return {
    ...transaction,
    amount: transaction.amount.toNumber(),
    date: transaction.date.toISOString(),
    category: mapCategoryToResponse(transaction.category),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString()
  };
}

export const transactionTypeDefs = /* GraphQL */ `
  enum TransactionType {
    EXPENSE
    INCOME
  }

  type Transaction {
    id: String!
    type: TransactionType!
    description: String!
    date: String!
    amount: Float!
    categoryId: String!
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  type TransactionsPage {
    items: [Transaction!]!
    page: Int!
    perPage: Int!
    totalItems: Int!
    totalPages: Int!
  }

  input TransactionFiltersInput {
    description: String
    type: TransactionType
    categoryId: String
    period: String
  }

  input CreateTransactionInput {
    type: TransactionType!
    description: String!
    date: String!
    amount: Float!
    categoryId: String!
  }

  input UpdateTransactionInput {
    type: TransactionType
    description: String
    date: String
    amount: Float
    categoryId: String
  }

  extend type Query {
    transactions(page: Int, perPage: Int, filters: TransactionFiltersInput): TransactionsPage!
    transaction(id: String!): Transaction
  }

  extend type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: String!, input: UpdateTransactionInput!): Transaction!
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
