import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import z from "zod";
import { Container } from "@/components/container";
import { TransactionsDataTable } from "@/components/pages/transactions/data-table";
import { Button } from "@/components/ui/button";
import { getTransactionsQueryOptions } from "@/lib/graphql/transactions/queries";

export const Route = createFileRoute("/_dash/transactions")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().optional()
  }),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ context, deps: { page } }) => {
    await context.queryClient.ensureQueryData(getTransactionsQueryOptions({ page, perPage: 10 }));
  }
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();
  const currentPage = page ?? 1;
  const { data: transactions } = useSuspenseQuery(getTransactionsQueryOptions({ page: currentPage, perPage: 10 }));

  function onPageChange(nextPage: number) {
    navigate({
      search: (previousSearch) => ({
        ...previousSearch,
        page: nextPage > 1 ? nextPage : undefined
      })
    });
  }

  return (
    <div>
      <Container className="flex flex-col gap-3 md:gap-6">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <div className="flex flex-col md:gap-0.5">
            <h1 className="font-bold text-gray-800 text-lg md:text-2xl">Transações</h1>
            <h2 className="font-normal text-gray-600 text-sm md:text-base">
              Gerencie todas as suas transações financeiras
            </h2>
          </div>

          <Button className="leading-snug" size="sm">
            <PlusIcon /> Nova transação
          </Button>
        </div>

        <TransactionsDataTable data={transactions} onPageChange={onPageChange} />
      </Container>
    </div>
  );
}
