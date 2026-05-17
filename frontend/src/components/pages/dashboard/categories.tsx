import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { CategoriesNameBadge } from "@/components/pages/categories/name-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyToBr } from "@/lib/formatters";
import type { DashboardData } from "@/lib/graphql/dashboard/schemas";

type DashboardCategoriesProps = {
  categories: DashboardData["topCategories"];
};

export function DashboardCategories({ categories }: DashboardCategoriesProps) {
  return (
    <Card className="py-0">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-gray-200 border-b px-4 py-3 md:px-6 md:py-5">
          <h2 className="font-medium text-gray-500 text-xs uppercase tracking-[0.12em]">Categorias</h2>
          <Link
            aria-label="Gerenciar categorias"
            className="flex items-center gap-1 font-semibold text-brand-base text-sm underline-offset-3 hover:underline"
            to="/categories"
          >
            Gerenciar
            <ChevronRightIcon className="size-5" />
          </Link>
        </div>

        <ul className="py-3 md:py-4">
          {categories.length > 0 ? (
            categories.map((categorySummary) => (
              <li className="flex items-center gap-2 px-4 py-3 md:gap-3 md:px-5" key={categorySummary.category.id}>
                <CategoriesNameBadge color={categorySummary.category.color} title={categorySummary.category.title} />
                <span className="ml-auto font-normal text-gray-600 text-sm">{`${categorySummary.transactionsCount} itens`}</span>
                <span className="min-w-[98px] text-right font-semibold text-gray-800 text-sm">
                  {formatCurrencyToBr(categorySummary.amountTotal)}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center font-medium text-gray-600 text-sm md:px-5">
              Nenhuma categoria encontrada.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
