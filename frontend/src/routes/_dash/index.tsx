import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CircleArrowDownIcon, CircleArrowUpIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/container";
import { DashboardCardHeader } from "@/components/pages/dashboard/card-header";
import { DashboardCategories } from "@/components/pages/dashboard/categories";
import { DashboardTransactions } from "@/components/pages/dashboard/transactions";
import { TransactionsModal } from "@/components/pages/transactions/modal";
import { getDashboardQueryOptions } from "@/lib/graphql/dashboard/queries";

export const Route = createFileRoute("/_dash/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getDashboardQueryOptions());
  },
  component: RouteComponent
});

function RouteComponent() {
  const { data: dashboardData } = useSuspenseQuery(getDashboardQueryOptions());
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  function onOpenCreateTransactionModal() {
    setIsTransactionModalOpen(true);
  }

  function onTransactionModalOpenChange(open: boolean) {
    setIsTransactionModalOpen(open);
  }

  if (!dashboardData) {
    return (
      <Container className="flex min-h-[40dvh] items-center justify-center">
        <p className="font-medium text-gray-600 text-sm">Faça login para visualizar o dashboard.</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="flex flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <DashboardCardHeader
            amount={dashboardData.totalBalance}
            icon={WalletIcon}
            title="Saldo total"
            tone="balance"
          />
          <DashboardCardHeader
            amount={dashboardData.currentMonthIncome}
            icon={CircleArrowUpIcon}
            title="Receitas do mês"
            tone="income"
          />
          <DashboardCardHeader
            amount={dashboardData.currentMonthExpense}
            icon={CircleArrowDownIcon}
            title="Despesas do mês"
            tone="expense"
          />
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <DashboardTransactions
              onOpenCreateTransaction={onOpenCreateTransactionModal}
              transactions={dashboardData.recentTransactions}
            />
          </div>
          <DashboardCategories categories={dashboardData.topCategories} />
        </div>
      </Container>

      <TransactionsModal open={isTransactionModalOpen} setOpen={onTransactionModalOpenChange} />
    </>
  );
}
