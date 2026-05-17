import { getDashboardQuery } from "./queries/get-dashboard";

export const dashboardTypeDefs = /* GraphQL */ `
  type DashboardCategorySummary {
    category: Category!
    transactionsCount: Int!
    amountTotal: Float!
  }

  type DashboardData {
    totalBalance: Float!
    currentMonthIncome: Float!
    currentMonthExpense: Float!
    recentTransactions: [Transaction!]!
    topCategories: [DashboardCategorySummary!]!
  }

  extend type Query {
    dashboard: DashboardData!
  }
`;

export const dashboardResolvers = {
  Query: {
    dashboard: getDashboardQuery
  }
};
