import { gql } from "graphql-request";
import { z } from "zod";

const FULL_NAME_PATTERN = /^[^\s]+(\s+[^\s]+)+$/;

const registerUserFormSchema = z.object({
  fullName: z.string().min(1, "O nome completo é obrigatório").regex(FULL_NAME_PATTERN, "Informe nome e sobrenome"),
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres")
});

type RegisterUserForm = z.infer<typeof registerUserFormSchema>;

const loginUserFormSchema = z.object({
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
  rememberMe: z.boolean()
});

type LoginUserForm = z.infer<typeof loginUserFormSchema>;

const meSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

type Me = z.infer<typeof meSchema>;

const userSelectionGQL = gql`
  fragment UserSelection on User {
    id
    name
    email
    createdAt
    updatedAt
  }
`;

export {
  type LoginUserForm,
  loginUserFormSchema,
  type Me,
  meSchema,
  type RegisterUserForm,
  registerUserFormSchema,
  userSelectionGQL
};
