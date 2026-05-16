import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Mail, UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInputController } from "@/components/form/form-input-controller";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { loginUserMutation } from "@/lib/graphql/user/mutations";
import { type LoginUserForm, loginUserFormSchema } from "@/lib/graphql/user/schemas";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent
});

function RouteComponent() {
  // const navigate = useNavigate();
  // const queryClient = useQueryClient();
  const { mutateAsync: loginUser, isPending: isLoggingIn } = loginUserMutation();

  const form = useForm<LoginUserForm>({
    resolver: standardSchemaResolver(loginUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  async function onSubmit(data: LoginUserForm) {
    try {
      const response = await loginUser(data);
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Não foi possível fazer login com os dados informados."));
    }
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
              autoComplete="current-password"
              control={form.control}
              icon={<Lock className="size-4" />}
              label="Senha"
              name="password"
              placeholder="Digite sua senha"
              type="password"
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
              {/* <Link
                className="font-medium text-brand-base text-sm underline-offset-2 hover:underline"
                to="/auth/recover"
              >
                Recuperar senha
              </Link> */}
            </div>

            <Button className="w-full" disabled={isLoggingIn} type="submit">
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
          <Button
            className="w-full gap-2"
            nativeButton={false}
            render={
              <Link to="/auth/register">
                <UserPlus className="size-4.5" />
                Criar conta
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
