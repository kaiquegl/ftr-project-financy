import { authResolvers, authTypeDefs } from "./modules/auth/auth.schema";

const baseTypeDefs = /* GraphQL */ `
  type Query
  type Mutation
`;

export const typeDefs = [baseTypeDefs, authTypeDefs].join("\n");

export const resolvers = {
  Query: {
    ...authResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation
  }
};
