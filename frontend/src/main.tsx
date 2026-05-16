/** biome-ignore-all lint/style/useConsistentTypeDefinitions: Tanstack Router Cfg */
/** biome-ignore-all lint/style/noNonNullAssertion: Tanstack Router Cfg */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import "@/assets/style/index.css";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, user: null },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-center" />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </StrictMode>
  );
}
