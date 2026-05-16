import { GraphQLClient } from "graphql-request";
import { env } from "../env";

export const graphqlClient = new GraphQLClient(env.VITE_GRAPHQL_URL, {
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      credentials: "include"
    })
});
