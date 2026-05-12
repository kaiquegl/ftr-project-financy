import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-gray-800 text-xl">Fazer login</CardTitle>
        <CardDescription className="text-base text-gray-600">Entre na sua conta para continuar</CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <Button className="w-full" type="submit">
            Entrar
          </Button>
        </form>
      </CardContent>
    </>
  );
}
