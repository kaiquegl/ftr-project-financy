import { authResolvers, authTypeDefs } from "./modules/auth/auth.schema";
import { categoryResolvers, categoryTypeDefs } from "./modules/category/category.schema";

const baseTypeDefs = /* GraphQL */ `
  type Query
  type Mutation
`;

export const typeDefs = [baseTypeDefs, authTypeDefs, categoryTypeDefs].join("\n");

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation
  }
};
