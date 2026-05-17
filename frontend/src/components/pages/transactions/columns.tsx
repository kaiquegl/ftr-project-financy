import type { ColumnDef } from "@tanstack/react-table";
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { CategoriesIconBadge } from "@/components/pages/categories/icon-badge";
import { CategoriesNameBadge } from "@/components/pages/categories/name-badge";
import { TransactionsTypeBadge } from "@/components/pages/transactions/type-badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyToBr, formatDateToShortBr } from "@/lib/formatters";
import type { TransactionItem } from "@/lib/graphql/transactions/schemas";

type GetTransactionsColumnsInput = {
  onEditTransaction: (transaction: TransactionItem) => void;
};

function getAmountLabel(transaction: TransactionItem): string {
  const prefix = transaction.type === "INCOME" ? "+" : "-";
  const formattedAmount = formatCurrencyToBr(Math.abs(transaction.amount));
  return `${prefix} ${formattedAmount}`;
}

export function getTransactionsColumns({
  onEditTransaction
}: GetTransactionsColumnsInput): ColumnDef<TransactionItem>[] {
  return [
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 md:gap-4">
          <CategoriesIconBadge color={row.original.category.color} icon={row.original.category.icon} />
          <span className="font-medium text-gray-800 text-sm md:text-base">{row.original.description}</span>
        </div>
      )
    },
    {
      accessorKey: "date",
      header: () => <div className="flex items-center justify-center">Data</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="font-normal text-gray-600 text-sm">{formatDateToShortBr(row.original.date)}</span>
        </div>
      )
    },
    {
      accessorKey: "category.title",
      header: () => <div className="flex items-center justify-center">Categoria</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <CategoriesNameBadge color={row.original.category.color} title={row.original.category.title} />
        </div>
      )
    },
    {
      accessorKey: "type",
      header: () => <div className="flex items-center justify-center">Tipo</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <TransactionsTypeBadge type={row.original.type} />
        </div>
      )
    },
    {
      accessorKey: "amount",
      header: () => <div className="flex items-center justify-end">Valor</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <span className="font-semibold text-gray-800 text-sm">{getAmountLabel(row.original)}</span>
        </div>
      )
    },
    {
      id: "actions",
      header: () => <div className="flex items-center justify-end">Ações</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="icon" variant="outline">
            <TrashIcon className="text-danger" />
          </Button>
          <Button onClick={() => onEditTransaction(row.original)} size="icon" variant="outline">
            <SquarePenIcon />
          </Button>
        </div>
      )
    }
  ];
}
