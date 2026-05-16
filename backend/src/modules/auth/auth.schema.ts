import { loginMutation } from "./mutations/login";
import { logoutMutation } from "./mutations/logout";
import { registerMutation } from "./mutations/register";
import { getMeQuery } from "./queries/get-me";

export type LoginArgs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterArgs = {
  input: {
    email: string;
    fullName: string;
    password: string;
  };
};

export function mapUserToResponse(user: { createdAt: Date; email: string; id: string; name: string; updatedAt: Date }) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

export const authTypeDefs = /* GraphQL */ `
  type AuthPayload {
    user: User!
  }

  input RegisterUserForm {
    fullName: String!
    email: String!
    password: String!
  }

  extend type Query {
    me: User!
  }

  extend type Mutation {
    register(input: RegisterUserForm!): AuthPayload!
    login(email: String!, password: String!, rememberMe: Boolean!): AuthPayload!
    logout: Boolean!
  }
`;

export const authResolvers = {
  Query: {
    me: getMeQuery
  },
  Mutation: {
    login: loginMutation,
    logout: logoutMutation,
    register: registerMutation
  }
};
