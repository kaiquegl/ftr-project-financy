import { gql } from "graphql-request";
import { z } from "zod";

const categoryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  icon: z.string(),
  color: z.string(),
  transactionsCount: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

type CategoryItem = z.infer<typeof categoryItemSchema>;

const categoryOverviewSchema = z.object({
  totalCategories: z.number(),
  totalTransactions: z.number(),
  mostUsedCategory: categoryItemSchema.nullable()
});

type CategoryOverview = z.infer<typeof categoryOverviewSchema>;

const createCategoryInputSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  icon: z.string().min(1, "O ícone é obrigatório"),
  color: z.string().min(1, "A cor é obrigatória")
});

type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

const updateCategoryInputSchema = z
  .object({
    title: z.string().min(1, "O título é obrigatório").optional(),
    description: z.string().optional(),
    icon: z.string().min(1, "O ícone é obrigatório").optional(),
    color: z.string().min(1, "A cor é obrigatória").optional()
  })
  .refine(
    (input) =>
      input.title !== undefined ||
      input.description !== undefined ||
      input.icon !== undefined ||
      input.color !== undefined,
    {
      message: "Informe ao menos um campo para atualização."
    }
  );

type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;

const categorySelectionGQL = gql`
  fragment CategorySelection on Category {
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

export {
  type CategoryItem,
  type CategoryOverview,
  type CreateCategoryInput,
  categoryItemSchema,
  categoryOverviewSchema,
  categorySelectionGQL,
  createCategoryInputSchema,
  type UpdateCategoryInput,
  updateCategoryInputSchema
};
