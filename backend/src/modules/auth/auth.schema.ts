export const authTypeDefs = /* GraphQL */ `
  type AuthPayload {
    token: String!
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthPayload!
  }
`;

export const authResolvers = {
  Mutation: {
    login: () => {
      throw new Error("Not implemented");
    }
  }
};
