import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import logo from "@/assets/imgs/logo.png?url";
import logoIcon from "@/assets/imgs/logo-icon.png?url";
import { Container } from "@/components/container";
import { getMeQueryOptions } from "@/lib/graphql/user/queries";

export const Route = createFileRoute("/_dash")({
  beforeLoad: async ({ context }) => {
    const currentUser = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!currentUser) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <div className="flex min-h-dvh flex-col gap-8 md:gap-12">
      <header className="border-gray-200 border-b bg-white">
        <Container className="flex items-center justify-between p-4">
          <Link to="/">
            <img
              alt="Financy Logo"
              className="hidden h-9 w-32 object-contain md:block"
              height={32}
              src={logo}
              width={128}
            />
            <img
              alt="Financy Logo"
              className="block size-9 object-contain md:hidden"
              height={36}
              src={logoIcon}
              width={36}
            />
          </Link>

          <ul className="flex items-center gap-3 md:gap-5">
            <li className="flex">
              <Link
                activeProps={{ className: "text-brand-base! font-semibold" }}
                aria-label="Ver Dashboard"
                className="text-gray-600 text-xs underline-offset-2 hover:text-brand-base hover:underline md:text-sm"
                to="/"
              >
                Dashboard
              </Link>
            </li>
            <li className="flex">
              <Link
                activeProps={{ className: "text-brand-base! font-semibold" }}
                aria-label="Ver Transações"
                className="text-gray-600 text-xs underline-offset-2 hover:text-brand-base hover:underline md:text-sm"
                to="/transactions"
              >
                Transações
              </Link>
            </li>
            <li className="flex">
              <Link
                activeProps={{ className: "text-brand-base! font-semibold" }}
                aria-label="Ver Categorias"
                className="text-gray-600 text-xs underline-offset-2 hover:text-brand-base hover:underline md:text-sm"
                to="/categories"
              >
                Categorias
              </Link>
            </li>
          </ul>

          <Link
            aria-label="Ver Perfil"
            className="flex size-9 items-center justify-center rounded-full bg-gray-300 font-medium text-gray-800 text-sm uppercase transition-colors hover:bg-gray-400"
            title="Ver Perfil"
            to="/profile"
          >
            {user?.name
              .split(" ")
              .map((name, index) => (index <= 1 ? name[0] : null))
              .filter(Boolean)
              .join("")}
          </Link>
        </Container>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
