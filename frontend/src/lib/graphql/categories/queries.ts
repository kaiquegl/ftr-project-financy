import { queryOptions } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  type CategoryItem,
  type CategoryOverview,
  categoryItemSchema,
  categoryOverviewSchema,
  categorySelectionGQL
} from "@/lib/graphql/categories/schemas";
import { graphqlClient } from "@/lib/graphql/client";
import { isUnauthenticatedError } from "@/lib/graphql/errors";

const getAllCategoriesGQL = gql`
  ${categorySelectionGQL}
  query GetAllCategories {
    getAllCategories {
      ...CategorySelection
    }
  }
`;

const getCategoryByIdGQL = gql`
  ${categorySelectionGQL}
  query GetCategoryById($id: String!) {
    getCategoryById(id: $id) {
      ...CategorySelection
    }
  }
`;

const getCategoriesOverviewGQL = gql`
  ${categorySelectionGQL}
  query GetCategoriesOverview {
    getCategoriesOverview {
      totalCategories
      totalTransactions
      mostUsedCategory {
        ...CategorySelection
      }
    }
  }
`;

async function fetchAllCategories(): Promise<CategoryItem[]> {
  try {
    const response = await graphqlClient.request<{ getAllCategories: CategoryItem[] }>(getAllCategoriesGQL);
    return categoryItemSchema.array().parse(response.getAllCategories);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return [];
    }

    throw error;
  }
}

async function fetchCategoryById(id: string): Promise<CategoryItem | null> {
  try {
    const response = await graphqlClient.request<{ getCategoryById: CategoryItem | null }>(getCategoryByIdGQL, { id });
    if (!response.getCategoryById) {
      return null;
    }

    return categoryItemSchema.parse(response.getCategoryById);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }

    throw error;
  }
}

async function fetchCategoriesOverview(): Promise<CategoryOverview | null> {
  try {
    const response = await graphqlClient.request<{ getCategoriesOverview: CategoryOverview }>(getCategoriesOverviewGQL);
    return categoryOverviewSchema.parse(response.getCategoriesOverview);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }

    throw error;
  }
}

function getAllCategoriesQueryOptions() {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

function getCategoryByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["categories", id],
    queryFn: () => fetchCategoryById(id),
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

function getCategoriesOverviewQueryOptions() {
  return queryOptions({
    queryKey: ["categories", "overview"],
    queryFn: fetchCategoriesOverview,
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

export { getAllCategoriesQueryOptions, getCategoriesOverviewQueryOptions, getCategoryByIdQueryOptions };
