import { gql } from "graphql-request";
import { z } from "zod";
import { categoryItemSchema, categorySelectionGQL } from "@/lib/graphql/categories/schemas";
import { transactionItemSchema, transactionSelectionGQL } from "@/lib/graphql/transactions/schemas";

const dashboardCategorySummarySchema = z.object({
  category: categoryItemSchema,
  transactionsCount: z.number(),
  amountTotal: z.number()
});

type DashboardCategorySummary = z.infer<typeof dashboardCategorySummarySchema>;

const dashboardDataSchema = z.object({
  totalBalance: z.number(),
  currentMonthIncome: z.number(),
  currentMonthExpense: z.number(),
  recentTransactions: transactionItemSchema.array(),
  topCategories: dashboardCategorySummarySchema.array()
});

type DashboardData = z.infer<typeof dashboardDataSchema>;

const dashboardSelectionGQL = gql`
  ${categorySelectionGQL}
  ${transactionSelectionGQL}
  fragment DashboardSelection on DashboardData {
    totalBalance
    currentMonthIncome
    currentMonthExpense
    recentTransactions {
      ...TransactionSelection
    }
    topCategories {
      transactionsCount
      amountTotal
      category {
        ...CategorySelection
      }
    }
  }
`;

export {
  type DashboardCategorySummary,
  type DashboardData,
  dashboardCategorySummarySchema,
  dashboardDataSchema,
  dashboardSelectionGQL
};
