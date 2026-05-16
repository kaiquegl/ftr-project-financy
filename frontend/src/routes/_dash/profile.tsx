import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { LogOutIcon, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInputController } from "@/components/form/form-input-controller";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { logoutUserMutation, updateUserMutation } from "@/lib/graphql/user/mutations";
import { type UpdateUserForm, updateUserFormSchema } from "@/lib/graphql/user/schemas";

export const Route = createFileRoute("/_dash/profile")({
  component: RouteComponent
});

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { mutateAsync: updateUser } = updateUserMutation();
  const { mutateAsync: logoutUser } = logoutUserMutation();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const form = useForm<UpdateUserForm>({
    resolver: standardSchemaResolver(updateUserFormSchema),
    defaultValues: {
      fullName: user?.name ?? ""
    }
  });

  async function onUpdateProfile(data: UpdateUserForm) {
    try {
      setIsUpdatingProfile(true);
      const updatedUser = await updateUser({ fullName: data.fullName });
      queryClient.setQueryData(["me"], updatedUser);
      await router.invalidate();
      toast.success("Perfil atualizado com sucesso.");
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Não foi possível atualizar seu perfil."));
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function onLogout() {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      queryClient.clear();
      await router.invalidate();
      await router.navigate({ to: "/auth/login", replace: true });
      toast.success("Até breve!");
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Não foi possível sair da conta."));
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="flex flex-col items-center gap-3 text-center md:gap-6">
          <span className="flex size-12 items-center justify-center rounded-full bg-gray-300 font-medium text-base text-gray-800 uppercase md:size-16 md:text-2xl">
            {user?.name
              .split(" ")
              .map((name, index) => (index <= 1 ? name[0] : null))
              .filter(Boolean)
              .join("")}
          </span>

          <div className="flex flex-col gap-0.5">
            <h1 className="font-semibold text-gray-800 text-sm md:text-xl">{user?.name}</h1>
            <h2 className="text-gray-500 text-sm md:text-base">{user?.email}</h2>
          </div>
        </CardHeader>

        <CardContent>
          <Separator />
          <form className="mt-6 space-y-5" noValidate onSubmit={form.handleSubmit(onUpdateProfile)}>
            <FormInputController
              autoComplete="name"
              control={form.control}
              icon={<User className="size-4" />}
              label="Nome completo"
              name="fullName"
              placeholder="Seu nome completo"
              type="text"
            />

            <Field data-disabled>
              <FieldLabel htmlFor="profile-email">E-mail</FieldLabel>
              <InputGroup data-disabled>
                <InputGroupAddon align="inline-start">
                  <Mail className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  autoComplete="email"
                  disabled
                  id="profile-email"
                  placeholder="mail@exemplo.com"
                  type="email"
                  value={user?.email ?? ""}
                />
              </InputGroup>
              <FieldDescription>O e-mail não pode ser alterado</FieldDescription>
            </Field>

            <Button className="w-full" isLoading={isUpdatingProfile} type="submit">
              Salvar alterações
            </Button>

            <Button className="w-full" isLoading={isLoggingOut} onClick={onLogout} type="button" variant="outline">
              <LogOutIcon className="size-4.5 text-danger" />
              Sair da conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
