import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
  rememberMe: z.boolean()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  function onSubmit(data: LoginFormValues) {
    console.log(data);
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-gray-800 text-xl">Fazer login</CardTitle>
        <CardDescription className="text-base text-gray-600">Entre na sua conta para continuar</CardDescription>
      </CardHeader>

      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <InputGroup className="h-11">
                    <InputGroupAddon align="inline-start">
                      <Mail className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                      id="email"
                      placeholder="mail@exemplo.com"
                      type="email"
                    />
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <InputGroup className="h-11">
                    <InputGroupAddon align="inline-start">
                      <Lock className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
                      id="password"
                      placeholder="Digite sua senha"
                      type={showPassword ? "text" : "password"}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex items-center justify-between">
              <Controller
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      id="rememberMe"
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <label className="cursor-pointer select-none text-gray-700 text-sm" htmlFor="rememberMe">
                      Lembrar-me
                    </label>
                  </div>
                )}
              />
              <a className="font-medium text-brand-base text-sm hover:text-brand-dark" href="/auth/recover">
                Recuperar senha
              </a>
            </div>

            <Button className="w-full" type="submit">
              Entrar
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
          <p className="text-muted-foreground text-sm">Ainda não tem uma conta?</p>
          <Button className="w-full" type="button" variant="outline">
            <UserPlus className="size-4" />
            Criar conta
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
