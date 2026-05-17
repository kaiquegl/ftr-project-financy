import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInputController } from "@/components/form/form-input-controller";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORY_COLOR_TOKENS, CATEGORY_ICON_TOKENS, getCategoryIconByToken } from "@/lib/graphql/categories/helpers";
import { createCategoryMutation, updateCategoryMutation } from "@/lib/graphql/categories/mutations";
import type { CategoryItem } from "@/lib/graphql/categories/schemas";
import { type CreateCategoryInput, createCategoryInputSchema } from "@/lib/graphql/categories/schemas";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { cn } from "@/lib/utils";

type CategoriesModalProps = {
  category?: CategoryItem;
  open: boolean;
  setOpen: (open: boolean) => void;
};

function getDefaultFormValues(category?: CategoryItem): CreateCategoryInput {
  return {
    title: category?.title ?? "",
    description: category?.description ?? "",
    icon: category?.icon ?? CATEGORY_ICON_TOKENS[0],
    color: category?.color ?? CATEGORY_COLOR_TOKENS[0]
  };
}

export function CategoriesModal({ category, open, setOpen }: CategoriesModalProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: createCategory, isPending: isCreatingCategory } = createCategoryMutation();
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } = updateCategoryMutation();
  const isSubmitting = isCreatingCategory || isUpdatingCategory;

  const form = useForm<CreateCategoryInput>({
    resolver: standardSchemaResolver(createCategoryInputSchema),
    defaultValues: getDefaultFormValues(category)
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(getDefaultFormValues(category));
  }, [category, form, open]);

  function onOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset(getDefaultFormValues());
    }

    setOpen(nextOpen);
  }

  async function onSubmit(values: CreateCategoryInput) {
    try {
      if (category?.id) {
        await updateCategory({
          id: category.id,
          input: values
        });
      } else {
        await createCategory(values);
      }

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(category?.id ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Não foi possível salvar a categoria."));
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>Organize suas transações com categorias.</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FormInputController
            control={form.control}
            id="category-title"
            label="Título"
            name="title"
            placeholder="Ex. Alimentação"
            type="text"
          />

          <FormInputController
            control={form.control}
            helperText="Opcional"
            id="category-description"
            label="Descrição"
            name="description"
            placeholder="Descrição da categoria"
            type="text"
          />

          <Controller
            control={form.control}
            name="icon"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Ícone</FieldLabel>
                <RadioGroup className="grid grid-cols-8 gap-2" onValueChange={field.onChange} value={field.value}>
                  {CATEGORY_ICON_TOKENS.map((iconToken) => {
                    const Icon = getCategoryIconByToken(iconToken);

                    return (
                      <RadioGroupItem
                        aria-label={`Selecionar ícone ${iconToken}`}
                        className={cn(
                          "flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border border-gray-300 text-gray-500 transition-colors",
                          "hover:border-brand-base hover:bg-gray-100 hover:text-gray-600",
                          "data-checked:border-brand-base data-checked:bg-gray-100 data-checked:text-gray-600",
                          "**:data-[slot=radio-group-indicator]:hidden"
                        )}
                        key={iconToken}
                        value={iconToken}
                      >
                        <Icon className="size-5" />
                      </RadioGroupItem>
                    );
                  })}
                </RadioGroup>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="color"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Cor</FieldLabel>
                <RadioGroup className="grid grid-cols-7 gap-2" onValueChange={field.onChange} value={field.value}>
                  {CATEGORY_COLOR_TOKENS.map((colorToken) => (
                    <RadioGroupItem
                      aria-label={`Selecionar cor ${colorToken}`}
                      className={cn(
                        "flex h-[30px] w-full items-center justify-center rounded-[8px] border border-gray-300 p-1 transition-colors",
                        "hover:border-brand-base hover:bg-gray-100",
                        "data-checked:border-brand-base data-checked:bg-gray-100",
                        "**:data-[slot=radio-group-indicator]:hidden"
                      )}
                      key={colorToken}
                      value={colorToken}
                    >
                      <span
                        className={cn("h-full w-full rounded-[4px]", {
                          "bg-green-base": colorToken === "green",
                          "bg-blue-base": colorToken === "blue",
                          "bg-purple-base": colorToken === "purple",
                          "bg-pink-base": colorToken === "pink",
                          "bg-red-base": colorToken === "red",
                          "bg-orange-base": colorToken === "orange",
                          "bg-yellow-base": colorToken === "yellow"
                        })}
                      />
                    </RadioGroupItem>
                  ))}
                </RadioGroup>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
