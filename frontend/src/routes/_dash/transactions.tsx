import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Container } from "@/components/container";
import { TransactionsDataTable } from "@/components/pages/transactions/data-table";
import { TransactionsFiltersForm, type TransactionsFiltersFormValues } from "@/components/pages/transactions/form";
import { TransactionsModal } from "@/components/pages/transactions/modal";
import { Button } from "@/components/ui/button";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { deleteTransactionMutation } from "@/lib/graphql/transactions/mutations";
import { getTransactionsQueryOptions } from "@/lib/graphql/transactions/queries";
import type { TransactionItem } from "@/lib/graphql/transactions/schemas";

export const Route = createFileRoute("/_dash/transactions")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(["EXPENSE", "INCOME"]).optional(),
    categoryId: z.string().optional(),
    period: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
      .optional()
  }),
  loaderDeps: ({ search }) => ({
    page: search.page,
    description: search.description,
    type: search.type,
    categoryId: search.categoryId,
    period: search.period
  }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      getTransactionsQueryOptions({
        page: deps.page,
        perPage: 10,
        filters: {
          description: deps.description,
          type: deps.type,
          categoryId: deps.categoryId,
          period: deps.period
        }
      })
    );
  }
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const { page, categoryId, description, period, type } = Route.useSearch();
  const currentPage = page ?? 1;
  const { data: transactions } = useSuspenseQuery(
    getTransactionsQueryOptions({
      page: currentPage,
      perPage: 10,
      filters: {
        description,
        type,
        categoryId,
        period
      }
    })
  );
  const { mutateAsync: deleteTransaction, isPending: isDeletingTransaction } = deleteTransactionMutation();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | undefined>(undefined);
  const currentFilters: TransactionsFiltersFormValues = {
    description: description ?? "",
    type: type ?? "ALL",
    categoryId: categoryId ?? "",
    period: period ?? ""
  };

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

  function onFiltersChange(filters: TransactionsFiltersFormValues) {
    navigate({
      search: (previousSearch) => ({
        ...previousSearch,
        page: undefined,
        description: filters.description || undefined,
        type: filters.type === "ALL" ? undefined : filters.type,
        categoryId: filters.categoryId || undefined,
        period: filters.period || undefined
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

        <TransactionsFiltersForm filters={currentFilters} onChange={onFiltersChange} />

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
