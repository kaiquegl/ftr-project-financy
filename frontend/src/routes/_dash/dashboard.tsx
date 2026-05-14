import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dash/dashboard")({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_dash/"!</div>;
}
