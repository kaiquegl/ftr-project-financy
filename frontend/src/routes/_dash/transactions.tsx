import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dash/transactions"!</div>
}
