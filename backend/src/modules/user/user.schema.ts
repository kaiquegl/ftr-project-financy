import { hashPassword } from "../../lib/auth";
import type { GraphqlContext } from "../../lib/graphql-context";

type GraphqlUserRecord = {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  updatedAt: Date;
};

function mapUserToResponse(user: GraphqlUserRecord) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
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
    users: async (_: unknown, __: unknown, { prisma }: GraphqlContext) => {
      const users = await prisma.user.findMany();
      return users.map(mapUserToResponse);
    },
    user: async (_: unknown, { id }: { id: string }, { prisma }: GraphqlContext) => {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? mapUserToResponse(user) : null;
    }
  },
  Mutation: {
    createUser: async (
      _: unknown,
      { input }: { input: { name: string; email: string; password: string } },
      { prisma }: GraphqlContext
    ) => {
      const hashedPassword = await hashPassword(input.password);
      const user = await prisma.user.create({
        data: {
          ...input,
          email: input.email.toLowerCase(),
          password: hashedPassword
        }
      });
      return mapUserToResponse(user);
    },
    updateUser: async (
      _: unknown,
      { id, input }: { id: string; input: { name?: string; email?: string; password?: string } },
      { prisma }: GraphqlContext
    ) => {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...input,
          email: input.email?.toLowerCase(),
          ...(input.password ? { password: await hashPassword(input.password) } : {})
        }
      });
      return mapUserToResponse(updatedUser);
    },
    deleteUser: async (_: unknown, { id }: { id: string }, { prisma }: GraphqlContext) => {
      await prisma.user.delete({ where: { id } });
      return true;
    }
  }
};
