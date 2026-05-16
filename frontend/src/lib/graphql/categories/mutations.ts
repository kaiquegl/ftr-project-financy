import { useMutation } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  type CategoryItem,
  type CreateCategoryInput,
  categoryItemSchema,
  categorySelectionGQL,
  type UpdateCategoryInput
} from "@/lib/graphql/categories/schemas";
import { graphqlClient } from "@/lib/graphql/client";

const createCategoryGQL = gql`
  ${categorySelectionGQL}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategorySelection
    }
  }
`;

const updateCategoryGQL = gql`
  ${categorySelectionGQL}
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategorySelection
    }
  }
`;

const deleteCategoryGQL = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;

type UpdateCategoryMutationInput = {
  id: string;
  input: UpdateCategoryInput;
};

const createCategoryMutation = () =>
  useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const response = await graphqlClient.request<{ createCategory: CategoryItem }>(createCategoryGQL, {
        input
      });

      return categoryItemSchema.parse(response.createCategory);
    }
  });

const updateCategoryMutation = () =>
  useMutation({
    mutationFn: async ({ id, input }: UpdateCategoryMutationInput) => {
      const response = await graphqlClient.request<{ updateCategory: CategoryItem }>(updateCategoryGQL, {
        id,
        input
      });

      return categoryItemSchema.parse(response.updateCategory);
    }
  });

const deleteCategoryMutation = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const response = await graphqlClient.request<{ deleteCategory: boolean }>(deleteCategoryGQL, {
        id
      });

      return response.deleteCategory;
    }
  });

export { createCategoryMutation, deleteCategoryMutation, updateCategoryMutation };
