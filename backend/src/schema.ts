import { authResolvers, authTypeDefs } from "./modules/auth/auth.schema";
import { categoryResolvers, categoryTypeDefs } from "./modules/category/category.schema";
import { transactionResolvers, transactionTypeDefs } from "./modules/transaction/transaction.schema";

const baseTypeDefs = /* GraphQL */ `
  type Query
  type Mutation
`;

export const typeDefs = [baseTypeDefs, authTypeDefs, categoryTypeDefs, transactionTypeDefs].join("\n");

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation
  }
};
