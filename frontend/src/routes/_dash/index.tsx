import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dash/")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="font-semibold text-2xl">Dashboard</h1>
    </div>
  );
}
