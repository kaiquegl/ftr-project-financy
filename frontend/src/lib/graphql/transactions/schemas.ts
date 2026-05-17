import { gql } from "graphql-request";
import { z } from "zod";

const periodPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const transactionTypeSchema = z.enum(["EXPENSE", "INCOME"]);

type TransactionType = z.infer<typeof transactionTypeSchema>;

const transactionCategoryOptionSchema = z.object({
  id: z.string(),
  title: z.string()
});

type TransactionCategoryOption = z.infer<typeof transactionCategoryOptionSchema>;

const transactionCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  icon: z.string(),
  color: z.string(),
  transactionsCount: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

type TransactionCategory = z.infer<typeof transactionCategorySchema>;

const transactionItemSchema = z.object({
  id: z.string(),
  type: transactionTypeSchema,
  description: z.string(),
  date: z.string(),
  amount: z.number(),
  categoryId: z.string(),
  category: transactionCategorySchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

type TransactionItem = z.infer<typeof transactionItemSchema>;

const transactionsPageSchema = z.object({
  items: transactionItemSchema.array(),
  page: z.number(),
  perPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number()
});

type TransactionsPage = z.infer<typeof transactionsPageSchema>;

const transactionFiltersInputSchema = z.object({
  description: z.string().optional(),
  type: transactionTypeSchema.optional(),
  categoryId: z.string().optional(),
  period: z.string().regex(periodPattern, "O periodo deve estar no formato AAAA-MM.").optional()
});

type TransactionFiltersInput = z.infer<typeof transactionFiltersInputSchema>;

const createTransactionInputSchema = z.object({
  type: transactionTypeSchema,
  description: z.string().min(1, "A descricao e obrigatoria."),
  date: z.string().min(1, "A data e obrigatoria."),
  amount: z.number().positive("O valor deve ser maior que zero."),
  categoryId: z.string().min(1, "A categoria e obrigatoria.")
});

type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;

const updateTransactionInputSchema = z
  .object({
    type: transactionTypeSchema.optional(),
    description: z.string().min(1, "A descricao e obrigatoria.").optional(),
    date: z.string().min(1, "A data e obrigatoria.").optional(),
    amount: z.number().positive("O valor deve ser maior que zero.").optional(),
    categoryId: z.string().min(1, "A categoria e obrigatoria.").optional()
  })
  .refine(
    (input) =>
      input.type !== undefined ||
      input.description !== undefined ||
      input.date !== undefined ||
      input.amount !== undefined ||
      input.categoryId !== undefined,
    {
      message: "Informe ao menos um campo para atualizacao."
    }
  );

type UpdateTransactionInput = z.infer<typeof updateTransactionInputSchema>;

const transactionCategoryOptionSelectionGQL = gql`
  fragment TransactionCategoryOptionSelection on Category {
    id
    title
  }
`;

const transactionCategorySelectionGQL = gql`
  fragment TransactionCategorySelection on Category {
    id
    title
    description
    icon
    color
    transactionsCount
    createdAt
    updatedAt
  }
`;

const transactionSelectionGQL = gql`
  ${transactionCategorySelectionGQL}
  fragment TransactionSelection on Transaction {
    id
    type
    description
    date
    amount
    categoryId
    category {
      ...TransactionCategorySelection
    }
    createdAt
    updatedAt
  }
`;

export {
  type CreateTransactionInput,
  createTransactionInputSchema,
  type TransactionCategory,
  type TransactionCategoryOption,
  type TransactionFiltersInput,
  type TransactionItem,
  type TransactionsPage,
  type TransactionType,
  transactionCategoryOptionSchema,
  transactionCategoryOptionSelectionGQL,
  transactionCategorySchema,
  transactionFiltersInputSchema,
  transactionItemSchema,
  transactionSelectionGQL,
  transactionsPageSchema,
  transactionTypeSchema,
  type UpdateTransactionInput,
  updateTransactionInputSchema
};
