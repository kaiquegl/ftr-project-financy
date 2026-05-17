import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, CircleArrowDown, CircleArrowUp, PlusIcon } from "lucide-react";
import { CategoriesIconBadge } from "@/components/pages/categories/icon-badge";
import { CategoriesNameBadge } from "@/components/pages/categories/name-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyToBr, formatDateToShortBr } from "@/lib/formatters";
import type { DashboardData } from "@/lib/graphql/dashboard/schemas";
import { cn } from "@/lib/utils";

type DashboardTransactionsProps = {
  transactions: DashboardData["recentTransactions"];
  onOpenCreateTransaction: () => void;
};

export function DashboardTransactions({ transactions, onOpenCreateTransaction }: DashboardTransactionsProps) {
  return (
    <Card className="py-0">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-gray-200 border-b px-4 py-3 md:px-6 md:py-5">
          <h2 className="font-medium text-gray-500 text-xs uppercase leading-tight tracking-[0.12em]">
            Transações recentes
          </h2>
          <Link
            aria-label="Ver todas as transações"
            className="flex items-center gap-1 font-semibold text-brand-base text-sm underline-offset-3 hover:underline"
            to="/transactions"
          >
            Ver todas
            <ChevronRightIcon className="size-5" />
          </Link>
        </div>

        <ul className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
              const isIncome = transaction.type === "INCOME";
              const amountSignal = isIncome ? "+" : "-";
              const amountClassName = isIncome ? "text-gray-800" : "text-gray-800";
              const StatusIcon = isIncome ? CircleArrowUp : CircleArrowDown;
              const statusClassName = isIncome ? "text-brand-base" : "text-red-base";

              return (
                <li className="flex items-center gap-3 px-4 py-3 md:gap-4 md:px-5" key={transaction.id}>
                  <CategoriesIconBadge color={transaction.category.color} icon={transaction.category.icon} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800 text-sm md:text-base">{transaction.description}</p>
                    <p className="font-normal text-gray-600 text-xs md:text-sm">
                      {formatDateToShortBr(transaction.date)}
                    </p>
                  </div>

                  <div className="hidden min-w-[140px] items-center justify-center md:flex">
                    <CategoriesNameBadge color={transaction.category.color} title={transaction.category.title} />
                  </div>

                  <div className="flex items-center gap-2 md:min-w-[150px] md:justify-end">
                    <p className={cn("font-semibold text-sm md:text-base", amountClassName)}>
                      {`${amountSignal} ${formatCurrencyToBr(transaction.amount)}`}
                    </p>
                    <StatusIcon className={cn("size-4", statusClassName)} />
                  </div>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-6 text-center font-medium text-gray-600 text-sm md:px-5">
              Nenhuma transação recente.
            </li>
          )}
        </ul>

        <div className="flex justify-center border-gray-200 border-t px-4 py-2 md:px-6 md:py-4">
          <Button
            className="h-auto gap-1 bg-transparent px-0 py-1.5 font-semibold text-brand-base hover:bg-transparent hover:text-green-dark"
            onClick={onOpenCreateTransaction}
            size="sm"
          >
            <PlusIcon className="size-4" />
            Nova transação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
