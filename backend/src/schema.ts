import { authResolvers, authTypeDefs } from "./modules/auth/auth.schema";
import { categoryResolvers, categoryTypeDefs } from "./modules/category/category.schema";
import { transactionResolvers, transactionTypeDefs } from "./modules/transaction/transaction.schema";
import { userResolvers, userTypeDefs } from "./modules/user/user.schema";

const baseTypeDefs = /* GraphQL */ `
  type Query
  type Mutation
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, authTypeDefs, transactionTypeDefs, categoryTypeDefs].join("\n");

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...transactionResolvers.Query,
    ...categoryResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
    ...transactionResolvers.Mutation,
    ...categoryResolvers.Mutation
  }
};
