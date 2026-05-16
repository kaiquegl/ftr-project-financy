import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dash/transactions")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4">
      <h1 className="font-semibold text-2xl">Transações</h1>
    </div>
  );
}
