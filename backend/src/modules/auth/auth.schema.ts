import { loginMutation } from "./mutations/login";
import { logoutMutation } from "./mutations/logout";
import { registerUserMutation } from "./mutations/register-user";
import { getMeQuery } from "./queries/get-me";

export function mapUserToResponse(user: { createdAt: Date; email: string; id: string; name: string; updatedAt: Date }) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

export const authTypeDefs = /* GraphQL */ `
  type User {
    id: String!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

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
    registerUser: registerUserMutation
  }
};
