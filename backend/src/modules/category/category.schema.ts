import { createCategoryMutation } from "./mutations/create";
import { deleteCategoryMutation } from "./mutations/delete";
import { updateCategoryMutation } from "./mutations/update";
import { getAllCategoriesQuery } from "./queries/get-all";
import { getCategoryByIdQuery } from "./queries/get-by-id";
import { getCategoriesOverviewQuery } from "./queries/get-overview";

type CategoryEntity = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapCategoryToResponse(category: CategoryEntity) {
  return {
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  };
}

export const categoryTypeDefs = /* GraphQL */ `
  type Category {
    id: String!
    title: String!
    description: String
    icon: String!
    color: String!
    createdAt: String!
    updatedAt: String!
  }

  type CategoriesOverview {
    totalCategories: Int!
    totalTransactions: Int!
    mostUsedCategory: Category
  }

  input CreateCategoryInput {
    title: String!
    description: String
    icon: String!
    color: String!
  }

  input UpdateCategoryInput {
    title: String
    description: String
    icon: String
    color: String
  }

  extend type Query {
    getAllCategories: [Category!]!
    getCategoryById(id: String!): Category
    getCategoriesOverview: CategoriesOverview!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: String!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: String!): Boolean!
  }
`;

export const categoryResolvers = {
  Query: {
    getAllCategories: getAllCategoriesQuery,
    getCategoryById: getCategoryByIdQuery,
    getCategoriesOverview: getCategoriesOverviewQuery
  },
  Mutation: {
    createCategory: createCategoryMutation,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation
  }
};
