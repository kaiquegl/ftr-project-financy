import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { CategoriesIconBadge } from "@/components/pages/categories/icon-badge";
import { CategoriesNameBadge } from "@/components/pages/categories/name-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryItem } from "@/lib/graphql/categories/schemas";

type CategoriesCardItemProps = {
  category: CategoryItem;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => Promise<void>;
  isDeleting: boolean;
};

export function CategoriesCardItem({ category, onDelete, onEdit, isDeleting }: CategoriesCardItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function onConfirmDelete() {
    await onDelete(category);
    setIsDeleteDialogOpen(false);
  }

  return (
    <Card>
      <CardContent className="flex flex-1 flex-col justify-between gap-3 md:gap-5">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <CategoriesIconBadge color={category.color} icon={category.icon} />

          <div className="flex items-center gap-2">
            <AlertDialog onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button disabled={isDeleting} size="icon" variant="outline">
                    <TrashIcon className="text-danger" />
                  </Button>
                }
              />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação remove a categoria <strong>{category.title}</strong> e não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction isLoading={isDeleting} onClick={onConfirmDelete}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => onEdit(category)} size="icon" variant="outline">
              <SquarePenIcon />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 md:gap-1">
          <p className="font-semibold text-gray-800 text-sm leading-tight md:text-base">{category.title}</p>
          <p className="line-clamp-2 font-normal text-gray-600 text-xs leading-tight md:text-sm">
            {category.description}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <CategoriesNameBadge color={category.color} title={category.title} />
          <span className="font-normal text-gray-600 text-sm leading-tight">{`${category.transactionsCount ?? 0} itens`}</span>
        </div>
      </CardContent>
    </Card>
  );
}
