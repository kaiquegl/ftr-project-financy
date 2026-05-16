import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDownIcon, TagIcon } from "lucide-react";
import { Container } from "@/components/container";
import { CategoriesCardHeader } from "@/components/pages/categories/card-header";
import { Button } from "@/components/ui/button";
import { getCategoryIconByToken, getCategoryIconColorClass } from "@/lib/graphql/categories/helpers";
import { getAllCategoriesQueryOptions, getCategoriesOverviewQueryOptions } from "@/lib/graphql/categories/queries";

export const Route = createFileRoute("/_dash/categories")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getAllCategoriesQueryOptions()),
      context.queryClient.ensureQueryData(getCategoriesOverviewQueryOptions())
    ]);
  }
});

function RouteComponent() {
  useSuspenseQuery(getAllCategoriesQueryOptions());
  const { data: categoriesOverview } = useSuspenseQuery(getCategoriesOverviewQueryOptions());
  const mostUsedCategory = categoriesOverview?.mostUsedCategory;
  const MostUsedCategoryIcon = getCategoryIconByToken(mostUsedCategory?.icon);
  const mostUsedCategoryIconColorClass = getCategoryIconColorClass(mostUsedCategory?.color);

  return (
    <div>
      <Container className="flex flex-col gap-3 md:gap-6">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <div className="flex flex-col md:gap-0.5">
            <h1 className="font-bold text-gray-800 text-lg md:text-2xl">Categorias</h1>
            <h2 className="font-normal text-gray-600 text-sm md:text-base">Organize suas transações por categorias</h2>
          </div>

          <Button size="sm">+ Nova categoria</Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:gap-6">
          <CategoriesCardHeader
            description="Total de categorias"
            icon={<TagIcon className="size-6 text-gray-700" />}
            title={categoriesOverview?.totalCategories.toString() ?? "0"}
          />
          <CategoriesCardHeader
            description="Total de transações"
            icon={<ArrowUpDownIcon className="size-6 text-purple-base" />}
            title={categoriesOverview?.totalTransactions.toString() ?? "0"}
          />
          <CategoriesCardHeader
            description="Categoria mais utilizada"
            icon={<MostUsedCategoryIcon className={`size-6 ${mostUsedCategoryIconColorClass}`} />}
            title={mostUsedCategory?.title ?? "Nenhuma"}
          />
        </div>
      </Container>
    </div>
  );
}
