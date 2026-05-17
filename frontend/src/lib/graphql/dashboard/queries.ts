import { queryOptions } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql/client";
import { type DashboardData, dashboardDataSchema, dashboardSelectionGQL } from "@/lib/graphql/dashboard/schemas";
import { isUnauthenticatedError } from "@/lib/graphql/errors";

const getDashboardGQL = gql`
  ${dashboardSelectionGQL}
  query GetDashboard {
    dashboard {
      ...DashboardSelection
    }
  }
`;

async function fetchDashboard(): Promise<DashboardData | null> {
  try {
    const response = await graphqlClient.request<{ dashboard: DashboardData }>(getDashboardGQL);
    return dashboardDataSchema.parse(response.dashboard);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }

    throw error;
  }
}

function getDashboardQueryOptions() {
  return queryOptions({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 60 * 1000 * 10,
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

export { getDashboardQueryOptions };
