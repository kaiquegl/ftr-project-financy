import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dash/categories")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4">
      <h1 className="font-semibold text-2xl">Categorias</h1>
    </div>
  );
}
