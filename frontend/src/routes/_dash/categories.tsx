import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDownIcon, PlusIcon, TagIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { CategoriesCardHeader } from "@/components/pages/categories/card-header";
import { CategoriesCardItem } from "@/components/pages/categories/card-item";
import { CategoriesModal } from "@/components/pages/categories/modal";
import { Button } from "@/components/ui/button";
import { getCategoryIconByToken, getCategoryIconColorClass } from "@/lib/graphql/categories/helpers";
import { deleteCategoryMutation } from "@/lib/graphql/categories/mutations";
import { getAllCategoriesQueryOptions, getCategoriesOverviewQueryOptions } from "@/lib/graphql/categories/queries";
import type { CategoryItem } from "@/lib/graphql/categories/schemas";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

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
  const queryClient = useQueryClient();
  const { data: categories } = useSuspenseQuery(getAllCategoriesQueryOptions());
  const { data: categoriesOverview } = useSuspenseQuery(getCategoriesOverviewQueryOptions());
  const { mutateAsync: deleteCategory, isPending: isDeletingCategory } = deleteCategoryMutation();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | undefined>(undefined);
  const mostUsedCategory = categoriesOverview?.mostUsedCategory;
  const MostUsedCategoryIcon = getCategoryIconByToken(mostUsedCategory?.icon);
  const mostUsedCategoryIconColorClass = getCategoryIconColorClass(mostUsedCategory?.color);

  function onOpenCreateCategoryModal() {
    setSelectedCategory(undefined);
    setIsCategoryModalOpen(true);
  }

  function onOpenEditCategoryModal(category: CategoryItem) {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  }

  function onCategoryModalOpenChange(open: boolean) {
    setIsCategoryModalOpen(open);
    if (!open) {
      setSelectedCategory(undefined);
    }
  }

  async function onDeleteCategory(category: CategoryItem) {
    try {
      await deleteCategory(category.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      ]);
      toast.success("Categoria excluida com sucesso.");
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Nao foi possivel excluir a categoria."));
    }
  }

  return (
    <div>
      <Container className="flex flex-col gap-3 md:gap-6">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <div className="flex flex-col md:gap-0.5">
            <h1 className="font-bold text-gray-800 text-lg md:text-2xl">Categorias</h1>
            <h2 className="font-normal text-gray-600 text-sm md:text-base">Organize suas transações por categorias</h2>
          </div>

          <Button className="leading-snug" onClick={onOpenCreateCategoryModal} size="sm">
            <PlusIcon /> Nova categoria
          </Button>
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

        <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoriesCardItem
              category={category}
              isDeleting={isDeletingCategory}
              key={category.id}
              onDelete={onDeleteCategory}
              onEdit={onOpenEditCategoryModal}
            />
          ))}
        </div>
      </Container>

      <CategoriesModal category={selectedCategory} open={isCategoryModalOpen} setOpen={onCategoryModalOpenChange} />
    </div>
  );
}
