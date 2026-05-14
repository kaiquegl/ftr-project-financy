import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LockIcon, LogInIcon, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormInputController } from "@/components/form/form-input-controller";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FULL_NAME_PATTERN = /^[^\s]+(\s+[^\s]+)+$/;

const registerSchema = z.object({
  fullName: z.string().min(1, "O nome completo é obrigatório").regex(FULL_NAME_PATTERN, "Informe nome e sobrenome"),
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent
});

function RouteComponent() {
  const form = useForm<RegisterFormValues>({
    resolver: standardSchemaResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  function onSubmit(data: RegisterFormValues) {
    console.log(data);
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-gray-800 text-xl">Criar conta</CardTitle>
        <CardDescription className="text-base text-gray-600">
          Comece a controlar suas finanças ainda hoje
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <FormInputController
              autoComplete="name"
              control={form.control}
              icon={<User className="size-4" />}
              label="Nome completo"
              name="fullName"
              placeholder="Seu nome completo"
              type="text"
            />

            <FormInputController
              autoComplete="email"
              control={form.control}
              icon={<Mail className="size-4" />}
              label="E-mail"
              name="email"
              placeholder="mail@exemplo.com"
              type="email"
            />

            <FormInputController
              autoComplete="new-password"
              control={form.control}
              helperText="A senha deve ter no mínimo 8 caracteres"
              icon={<LockIcon className="size-4" />}
              label="Senha"
              name="password"
              placeholder="Digite sua senha"
              type="password"
            />

            <Button className="w-full" type="submit">
              Cadastrar
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex w-full flex-col gap-4">
        <div className="relative w-full">
          <Separator />
          <span className="absolute top-1/2 left-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-muted-foreground text-sm">
            ou
          </span>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-muted-foreground text-sm">Já tem uma conta?</p>
          <Button
            className="w-full gap-2"
            render={
              <Link to="/auth/login">
                <LogInIcon className="size-4.5" />
                Fazer login
              </Link>
            }
            type="button"
            variant="outline"
          />
        </div>
      </CardFooter>
    </>
  );
}
