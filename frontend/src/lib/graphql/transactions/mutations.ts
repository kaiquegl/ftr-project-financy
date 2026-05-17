import { useMutation } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql/client";
import {
  type CreateTransactionInput,
  type TransactionItem,
  transactionItemSchema,
  transactionSelectionGQL,
  type UpdateTransactionInput
} from "@/lib/graphql/transactions/schemas";

const createTransactionGQL = gql`
  ${transactionSelectionGQL}
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionSelection
    }
  }
`;

const updateTransactionGQL = gql`
  ${transactionSelectionGQL}
  mutation UpdateTransaction($id: String!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionSelection
    }
  }
`;

const deleteTransactionGQL = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`;

type UpdateTransactionMutationInput = {
  id: string;
  input: UpdateTransactionInput;
};

const createTransactionMutation = () =>
  useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const response = await graphqlClient.request<{ createTransaction: TransactionItem }>(createTransactionGQL, {
        input
      });

      return transactionItemSchema.parse(response.createTransaction);
    }
  });

const updateTransactionMutation = () =>
  useMutation({
    mutationFn: async ({ id, input }: UpdateTransactionMutationInput) => {
      const response = await graphqlClient.request<{ updateTransaction: TransactionItem }>(updateTransactionGQL, {
        id,
        input
      });

      return transactionItemSchema.parse(response.updateTransaction);
    }
  });

const deleteTransactionMutation = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const response = await graphqlClient.request<{ deleteTransaction: boolean }>(deleteTransactionGQL, {
        id
      });

      return response.deleteTransaction;
    }
  });

export { createTransactionMutation, deleteTransactionMutation, updateTransactionMutation };
