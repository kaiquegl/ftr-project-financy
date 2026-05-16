import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import logo from "@/assets/imgs/logo.png?url";
import { Card } from "@/components/ui/card";
import { getMeQueryOptions } from "@/lib/graphql/user/queries";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const currentUser = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (currentUser) {
      throw redirect({ to: "/" });
    }

    if (location.pathname === "/auth" || location.pathname === "/auth/") {
      throw redirect({ to: "/auth/login" });
    }
  }
});

function RouteComponent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8">
      <img alt="Financy Logo" className="h-8 w-32 object-contain" height={32} src={logo} width={128} />

      <Card className="w-full max-w-md">
        <Outlet />
      </Card>
    </div>
  );
}
