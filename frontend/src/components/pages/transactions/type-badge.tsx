import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import type { TransactionType } from "@/lib/graphql/transactions/schemas";
import { cn } from "@/lib/utils";

type TransactionsTypeBadgeProps = {
  type: TransactionType;
};

export function TransactionsTypeBadge({ type }: TransactionsTypeBadgeProps) {
  const isIncome = type === "INCOME";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-medium text-sm",
        isIncome ? "text-green-dark" : "text-red-dark"
      )}
    >
      {isIncome ? <ArrowUpCircleIcon className="size-4" /> : <ArrowDownCircleIcon className="size-4" />}
      {isIncome ? "Entrada" : "Saída"}
    </span>
  );
}
