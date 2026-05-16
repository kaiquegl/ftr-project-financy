import { useMutation } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql/client";
import { type LoginUserForm, type Me, type RegisterUserForm, userSelectionGQL } from "@/lib/graphql/user/schemas";

const loginUserGQL = gql`
  ${userSelectionGQL}
  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {
    login(email: $email, password: $password, rememberMe: $rememberMe) {
      user {
        ...UserSelection
      }
    }
  }
`;

const registerUserGQL = gql`
  ${userSelectionGQL}
  mutation RegisterUser($input: RegisterUserForm!) {
    register(input: $input) {
      user {
        ...UserSelection
      }
    }
  }
`;

const logoutUserGQL = gql`
  mutation Logout {
    logout
  }
`;

const loginUserMutation = () =>
  useMutation({
    mutationFn: async (input: LoginUserForm) => {
      const response = await graphqlClient.request<{ login: { user: Me } }>(loginUserGQL, input);
      return response.login.user;
    }
  });

const registerUserMutation = () =>
  useMutation({
    mutationFn: async (input: RegisterUserForm) => {
      const response = await graphqlClient.request<{ register: { user: Me } }>(registerUserGQL, {
        input
      });
      return response.register.user;
    }
  });

const logoutUserMutation = () =>
  useMutation({
    mutationFn: async () => {
      const response = await graphqlClient.request<{ logout: boolean }>(logoutUserGQL);
      return response.logout;
    }
  });

export { loginUserMutation, logoutUserMutation, registerUserMutation };
