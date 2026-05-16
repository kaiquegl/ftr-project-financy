import { ClientError } from "graphql-request";

function getGraphQLErrorCode(error: ClientError): string | undefined {
  return error.response.errors?.[0]?.extensions?.code as string | undefined;
}

export function isUnauthenticatedError(error: unknown): boolean {
  if (!(error instanceof ClientError)) {
    return false;
  }

  return getGraphQLErrorCode(error) === "UNAUTHENTICATED";
}

export function getGraphQLErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
