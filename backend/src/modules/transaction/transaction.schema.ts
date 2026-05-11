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
    transactions: () => [],
    transaction: () => null
  },
  Mutation: {
    createTransaction: () => {
      throw new Error("Not implemented");
    },
    updateTransaction: () => {
      throw new Error("Not implemented");
    },
    deleteTransaction: () => {
      throw new Error("Not implemented");
    }
  }
};
