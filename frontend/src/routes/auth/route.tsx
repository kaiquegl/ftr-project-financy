import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent
  // beforeLoad: ({ location }) => {
  //   if (location.pathname === "/auth") {
  //     return redirect({ to: "/auth/login" });
  //   }
  // }
});

function RouteComponent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8">
      <Outlet />
    </div>
  );
}
