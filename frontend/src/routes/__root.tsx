import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import favicon from "@/assets/imgs/logo-icon.png?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootDocument,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "FTR - Financy" },
      { name: "description", content: "Organização de finanças, com gestão de transações e categorias" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
      }
    ],
    links: [
      // { rel: "stylesheet", href: appCss },
      { rel: "icon", href: favicon }
    ]
  })
});

function RootDocument() {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="relative tabular-nums">
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
