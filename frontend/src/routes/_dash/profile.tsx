import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { createFileRoute } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type UpdateUserForm, updateUserFormSchema } from "@/lib/graphql/user/schemas";

export const Route = createFileRoute("/_dash/profile")({
  component: RouteComponent
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  const form = useForm<UpdateUserForm>({
    resolver: standardSchemaResolver(updateUserFormSchema),
    defaultValues: {
      fullName: user?.name ?? ""
    }
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4">
      <Card>
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
          <form />
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline">
            <LogOutIcon className="size-4.5 text-danger" />
            Sair da conta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
