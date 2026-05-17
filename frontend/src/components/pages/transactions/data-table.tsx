import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Fragment } from "react";
import { getTransactionsColumns } from "@/components/pages/transactions/columns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionItem, TransactionsPage } from "@/lib/graphql/transactions/schemas";

type TransactionsDataTableProps = {
  data: TransactionsPage;
  onEditTransaction: (transaction: TransactionItem) => void;
  onDeleteTransaction: (transaction: TransactionItem) => Promise<void>;
  isDeletingTransaction: boolean;
  onPageChange: (page: number) => void;
};

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  const pagesToRender = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pagesToRender].filter((page) => page >= 1 && page <= totalPages).sort((pageA, pageB) => pageA - pageB);
}

export function TransactionsDataTable({
  data,
  onDeleteTransaction,
  onEditTransaction,
  isDeletingTransaction,
  onPageChange
}: TransactionsDataTableProps) {
  const totalItems = data.totalItems;
  const currentPage = Math.max(1, Math.min(data.page, Math.max(1, data.totalPages)));
  const visiblePages = getVisiblePages(currentPage, Math.max(1, data.totalPages));
  const startItem = totalItems > 0 ? (currentPage - 1) * data.perPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * data.perPage, totalItems) : 0;
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < data.totalPages;
  const transactionsColumns = getTransactionsColumns({
    onDeleteTransaction,
    onEditTransaction,
    isDeletingTransaction
  });

  const table = useReactTable({
    data: data.items,
    columns: transactionsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="h-14 px-4 font-medium text-gray-500 text-xs uppercase" key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="hover:bg-transparent" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="h-14 px-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell className="h-20 text-center text-gray-600" colSpan={transactionsColumns.length}>
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-gray-200 border-t px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
        <span className="font-medium text-gray-600 text-sm">{`${startItem} a ${endItem} | ${totalItems} resultados`}</span>

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoPrevious) {
                    onPageChange(currentPage - 1);
                  }
                }}
                text=""
              />
            </PaginationItem>

            {visiblePages.map((pageNumber, index) => {
              const previousPage = visiblePages[index - 1];
              const shouldShowEllipsis = previousPage !== undefined && pageNumber - previousPage > 1;

              return (
                <Fragment key={pageNumber}>
                  {shouldShowEllipsis ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNumber}
                      onClick={(event) => {
                        event.preventDefault();
                        onPageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                </Fragment>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoNext) {
                    onPageChange(currentPage + 1);
                  }
                }}
                text=""
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
