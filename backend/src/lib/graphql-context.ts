import type { PrismaClient, User } from "@prisma/client";

export type GraphqlContext = {
  prisma: PrismaClient;
  request: Request;
  currentUser: User | null;
};
