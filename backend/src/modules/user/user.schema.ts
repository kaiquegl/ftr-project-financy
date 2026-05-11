import type { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: String!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }

  extend type Query {
    users: [User!]!
    user(id: String!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: String!, input: UpdateUserInput!): User!
    deleteUser(id: String!): Boolean!
  }
`;

export const userResolvers = {
  Query: {
    users: (_: unknown, __: unknown, { prisma }: Context) => prisma.user.findMany(),
    user: (_: unknown, { id }: { id: string }, { prisma }: Context) => prisma.user.findUnique({ where: { id } })
  },
  Mutation: {
    createUser: (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } },
      { prisma }: Context
    ) => prisma.user.create({ data: input }),
    updateUser: (
      _: unknown,
      { id, input }: { id: string; input: { name?: string; email?: string; password?: string } },
      { prisma }: Context
    ) => prisma.user.update({ where: { id }, data: input }),
    deleteUser: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      await prisma.user.delete({ where: { id } });
      return true;
    }
  }
};
