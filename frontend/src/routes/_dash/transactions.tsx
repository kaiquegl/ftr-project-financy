import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Container } from "@/components/container";
import { TransactionsDataTable } from "@/components/pages/transactions/data-table";
import { TransactionsModal } from "@/components/pages/transactions/modal";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { deleteTransactionMutation } from "@/lib/graphql/transactions/mutations";
import { getTransactionsQueryOptions } from "@/lib/graphql/transactions/queries";
import type { TransactionItem } from "@/lib/graphql/transactions/schemas";

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
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();
  const currentPage = page ?? 1;
  const { data: transactions } = useSuspenseQuery(getTransactionsQueryOptions({ page: currentPage, perPage: 10 }));
  const { mutateAsync: deleteTransaction, isPending: isDeletingTransaction } = deleteTransactionMutation();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | undefined>(undefined);

  function onOpenCreateTransactionModal() {
    setSelectedTransaction(undefined);
    setIsTransactionModalOpen(true);
  }

  function onOpenEditTransactionModal(transaction: TransactionItem) {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  }

  function onTransactionModalOpenChange(open: boolean) {
    setIsTransactionModalOpen(open);
    if (!open) {
      setSelectedTransaction(undefined);
    }
  }

  function onPageChange(nextPage: number) {
    navigate({
      search: (previousSearch) => ({
        ...previousSearch,
        page: nextPage > 1 ? nextPage : undefined
      })
    });
  }

  async function onDeleteTransaction(transaction: TransactionItem) {
    try {
      await deleteTransaction(transaction.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      ]);
      toast.success("Transacao excluida com sucesso.");
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Nao foi possivel excluir a transacao."));
    }
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

          <Button className="leading-snug" onClick={onOpenCreateTransactionModal} size="sm">
            <PlusIcon /> Nova transação
          </Button>
        </div>

        <TransactionsDataTable
          data={transactions}
          isDeletingTransaction={isDeletingTransaction}
          onDeleteTransaction={onDeleteTransaction}
          onEditTransaction={onOpenEditTransactionModal}
          onPageChange={onPageChange}
        />
      </Container>

      <TransactionsModal
        open={isTransactionModalOpen}
        setOpen={onTransactionModalOpenChange}
        transaction={selectedTransaction}
      />
    </div>
  );
}
