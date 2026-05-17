import { queryOptions } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql/client";
import { isUnauthenticatedError } from "@/lib/graphql/errors";
import {
  type TransactionCategoryOption,
  type TransactionFiltersInput,
  type TransactionItem,
  type TransactionPeriodOption,
  type TransactionsPage,
  transactionCategoryOptionSchema,
  transactionCategoryOptionSelectionGQL,
  transactionItemSchema,
  transactionPeriodOptionSchema,
  transactionSelectionGQL,
  transactionsPageSchema
} from "@/lib/graphql/transactions/schemas";

const emptyTransactionsPage: TransactionsPage = {
  items: [],
  page: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0
};

const getTransactionsGQL = gql`
  ${transactionSelectionGQL}
  query GetTransactions($page: Int, $perPage: Int, $filters: TransactionFiltersInput) {
    transactions(page: $page, perPage: $perPage, filters: $filters) {
      items {
        ...TransactionSelection
      }
      page
      perPage
      totalItems
      totalPages
    }
  }
`;

const getTransactionByIdGQL = gql`
  ${transactionSelectionGQL}
  query GetTransactionById($id: String!) {
    transaction(id: $id) {
      ...TransactionSelection
    }
  }
`;

const getTransactionCategoriesOptionsGQL = gql`
  ${transactionCategoryOptionSelectionGQL}
  query GetTransactionCategoriesOptions {
    categories {
      ...TransactionCategoryOptionSelection
    }
  }
`;

const getTransactionCategoriesWithTransactionsOptionsGQL = gql`
  ${transactionCategoryOptionSelectionGQL}
  query GetTransactionCategoriesWithTransactionsOptions {
    categories(onlyWithTransactions: true) {
      ...TransactionCategoryOptionSelection
    }
  }
`;

const getTransactionPeriodsOptionsGQL = gql`
  query GetTransactionPeriodsOptions {
    transactionPeriods
  }
`;

type GetTransactionsInput = {
  page?: number;
  perPage?: number;
  filters?: TransactionFiltersInput;
};

function normalizeFilters(filters?: TransactionFiltersInput): TransactionFiltersInput | undefined {
  if (!filters) {
    return;
  }

  const parsedFilters: TransactionFiltersInput = {};

  if (filters.description !== undefined && filters.description !== "") {
    parsedFilters.description = filters.description;
  }

  if (filters.type !== undefined) {
    parsedFilters.type = filters.type;
  }

  if (filters.categoryId !== undefined && filters.categoryId !== "") {
    parsedFilters.categoryId = filters.categoryId;
  }

  if (filters.period !== undefined && filters.period !== "") {
    parsedFilters.period = filters.period;
  }

  return Object.keys(parsedFilters).length > 0 ? parsedFilters : undefined;
}

async function fetchTransactions({ page, perPage, filters }: GetTransactionsInput): Promise<TransactionsPage> {
  try {
    const normalizedFilters = normalizeFilters(filters);

    const response = await graphqlClient.request<{ transactions: TransactionsPage }>(getTransactionsGQL, {
      page,
      perPage,
      filters: normalizedFilters
    });

    return transactionsPageSchema.parse(response.transactions);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return emptyTransactionsPage;
    }

    throw error;
  }
}

async function fetchTransactionById(id: string): Promise<TransactionItem | null> {
  try {
    const response = await graphqlClient.request<{ transaction: TransactionItem | null }>(getTransactionByIdGQL, {
      id
    });

    if (!response.transaction) {
      return null;
    }

    return transactionItemSchema.parse(response.transaction);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }

    throw error;
  }
}

async function fetchTransactionCategoriesOptions(): Promise<TransactionCategoryOption[]> {
  try {
    const response = await graphqlClient.request<{ categories: TransactionCategoryOption[] }>(
      getTransactionCategoriesOptionsGQL
    );

    return transactionCategoryOptionSchema.array().parse(response.categories);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return [];
    }

    throw error;
  }
}

async function fetchTransactionCategoriesWithTransactionsOptions(): Promise<TransactionCategoryOption[]> {
  try {
    const response = await graphqlClient.request<{ categories: TransactionCategoryOption[] }>(
      getTransactionCategoriesWithTransactionsOptionsGQL
    );

    return transactionCategoryOptionSchema.array().parse(response.categories);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return [];
    }

    throw error;
  }
}

async function fetchTransactionPeriodsOptions(): Promise<TransactionPeriodOption[]> {
  try {
    const response = await graphqlClient.request<{ transactionPeriods: TransactionPeriodOption[] }>(
      getTransactionPeriodsOptionsGQL
    );

    return transactionPeriodOptionSchema.array().parse(response.transactionPeriods);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return [];
    }

    throw error;
  }
}

function getTransactionsQueryOptions(input: GetTransactionsInput = {}) {
  const normalizedFilters = normalizeFilters(input.filters);
  const normalizedInput = {
    page: input.page ?? 1,
    perPage: input.perPage ?? 10,
    filters: normalizedFilters ?? null
  };

  return queryOptions({
    queryKey: ["transactions", "list", normalizedInput],
    queryFn: () => fetchTransactions(input),
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

function getTransactionByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["transactions", id],
    queryFn: () => fetchTransactionById(id),
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

function getTransactionCategoriesOptionsQueryOptions() {
  return queryOptions({
    queryKey: ["transactions", "categories-options"],
    queryFn: fetchTransactionCategoriesOptions,
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

function getTransactionCategoriesWithTransactionsOptionsQueryOptions() {
  return queryOptions({
    queryKey: ["transactions", "categories-options", "with-transactions"],
    queryFn: fetchTransactionCategoriesWithTransactionsOptions,
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

function getTransactionPeriodsOptionsQueryOptions() {
  return queryOptions({
    queryKey: ["transactions", "periods-options"],
    queryFn: fetchTransactionPeriodsOptions,
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

export {
  type GetTransactionsInput,
  getTransactionByIdQueryOptions,
  getTransactionCategoriesOptionsQueryOptions,
  getTransactionCategoriesWithTransactionsOptionsQueryOptions,
  getTransactionPeriodsOptionsQueryOptions,
  getTransactionsQueryOptions
};
