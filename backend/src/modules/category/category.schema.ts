export const categoryTypeDefs = /* GraphQL */ `
  type Category {
    id: String!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    categories: [Category!]!
    category(id: String!): Category
  }

  extend type Mutation {
    createCategory(name: String!): Category!
    updateCategory(id: String!, name: String!): Category!
    deleteCategory(id: String!): Boolean!
  }
`;

export const categoryResolvers = {
  Query: {
    categories: () => [],
    category: () => null
  },
  Mutation: {
    createCategory: () => {
      throw new Error("Not implemented");
    },
    updateCategory: () => {
      throw new Error("Not implemented");
    },
    deleteCategory: () => {
      throw new Error("Not implemented");
    }
  }
};
