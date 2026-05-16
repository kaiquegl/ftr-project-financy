import { queryOptions } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql/client";
import { isUnauthenticatedError } from "@/lib/graphql/errors";
import { type Me, userSelectionGQL } from "@/lib/graphql/user/schemas";

const meQuery = gql`
  ${userSelectionGQL}
  query Me {
    me {
      ...UserSelection
    }
  }
`;

async function fetchMe(): Promise<Me | null> {
  try {
    const response = await graphqlClient.request<{ me: Me }>(meQuery);
    return response.me;
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }

    throw error;
  }
}

function getMeQueryOptions() {
  return queryOptions({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 60 * 1000 * 10, // 10 minutes
    retry: (failureCount, error) => !isUnauthenticatedError(error) && failureCount < 2
  });
}

export { getMeQueryOptions };
