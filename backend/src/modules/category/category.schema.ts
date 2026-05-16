import { createCategoryMutation } from "./mutations/create";
import { deleteCategoryMutation } from "./mutations/delete";
import { updateCategoryMutation } from "./mutations/update";
import { getAllCategoriesQuery } from "./queries/get-all";
import { getCategoryByIdQuery } from "./queries/get-by-id";

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
    categories: getAllCategoriesQuery,
    category: getCategoryByIdQuery
  },
  Mutation: {
    createCategory: createCategoryMutation,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation
  }
};
