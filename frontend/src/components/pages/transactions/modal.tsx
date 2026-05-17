import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInputController } from "@/components/form/form-input-controller";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { createTransactionMutation, updateTransactionMutation } from "@/lib/graphql/transactions/mutations";
import { getTransactionCategoriesOptionsQueryOptions } from "@/lib/graphql/transactions/queries";
import {
  type CreateTransactionInput,
  createTransactionInputSchema,
  type TransactionItem
} from "@/lib/graphql/transactions/schemas";
import { cn } from "@/lib/utils";

type TransactionsModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transaction?: TransactionItem;
};

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

function parseTransactionDate(dateValue: string): string {
  if (dateValue === "") {
    return "";
  }

  if (dateOnlyPattern.test(dateValue)) {
    return dateValue;
  }

  const parsedDate = parseISO(dateValue);
  if (isValid(parsedDate)) {
    return format(parsedDate, "yyyy-MM-dd");
  }

  const fallbackParsedDate = new Date(dateValue);
  if (isValid(fallbackParsedDate)) {
    return format(fallbackParsedDate, "yyyy-MM-dd");
  }

  return "";
}

function parseDateFromFormValue(dateValue: string): Date | undefined {
  if (dateValue === "") {
    return;
  }

  const parsedDate = dateOnlyPattern.test(dateValue) ? parse(dateValue, "yyyy-MM-dd", new Date()) : parseISO(dateValue);

  return isValid(parsedDate) ? parsedDate : undefined;
}

function getDefaultFormValues(transaction?: TransactionItem): CreateTransactionInput {
  const todayDateValue = format(new Date(), "yyyy-MM-dd");

  return {
    type: transaction?.type ?? "EXPENSE",
    description: transaction?.description ?? "",
    date: transaction ? parseTransactionDate(transaction.date) : todayDateValue,
    amount: transaction?.amount ?? 0,
    categoryId: transaction?.categoryId ?? ""
  };
}

function parseAmountValue(rawValue: string): number {
  const normalizedValue = rawValue.replace(/[^\d,]/g, "").replace(",", ".");
  const parsedAmount = Number.parseFloat(normalizedValue);

  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
}

function formatAmountValue(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function TransactionsModal({ open, setOpen, transaction }: TransactionsModalProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: createTransaction, isPending: isCreatingTransaction } = createTransactionMutation();
  const { mutateAsync: updateTransaction, isPending: isUpdatingTransaction } = updateTransactionMutation();
  const { data: categoryOptions = [], isPending: isLoadingCategoryOptions } = useQuery(
    getTransactionCategoriesOptionsQueryOptions()
  );
  const isSubmitting = isCreatingTransaction || isUpdatingTransaction;
  const [amountDisplayValue, setAmountDisplayValue] = useState("0,00");

  const form = useForm<CreateTransactionInput>({
    resolver: standardSchemaResolver(createTransactionInputSchema),
    defaultValues: getDefaultFormValues(transaction)
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const defaultFormValues = getDefaultFormValues(transaction);
    form.reset(defaultFormValues);
    setAmountDisplayValue(formatAmountValue(defaultFormValues.amount));
  }, [form, open, transaction]);

  function onOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      const defaultFormValues = getDefaultFormValues();
      form.reset(defaultFormValues);
      setAmountDisplayValue(formatAmountValue(defaultFormValues.amount));
    }

    setOpen(nextOpen);
  }

  async function onSubmit(values: CreateTransactionInput) {
    try {
      if (transaction?.id) {
        await updateTransaction({
          id: transaction.id,
          input: values
        });
      } else {
        await createTransaction(values);
      }

      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success(transaction?.id ? "Transação atualizada com sucesso." : "Transação criada com sucesso.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, "Não foi possível salvar a transação."));
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl gap-5 p-6">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Atualize sua despesa ou receita" : "Registre sua despesa ou receita"}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <RadioGroup className="grid grid-cols-2 gap-3" onValueChange={field.onChange} value={field.value}>
                  <RadioGroupItem
                    aria-label="Selecionar despesa"
                    className={cn(
                      "flex h-16 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 text-gray-600",
                      "hover:border-red-base hover:bg-red-base/5 hover:text-red-base",
                      "data-checked:border-red-base data-checked:bg-red-base/5 data-checked:text-red-base",
                      "**:data-[slot=radio-group-indicator]:hidden"
                    )}
                    value="EXPENSE"
                  >
                    <ArrowDownCircleIcon className="size-5" />
                    <span className="font-semibold text-xl">Despesa</span>
                  </RadioGroupItem>
                  <RadioGroupItem
                    aria-label="Selecionar receita"
                    className={cn(
                      "flex h-16 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 text-gray-600",
                      "hover:border-green-base hover:bg-green-base/5 hover:text-green-dark",
                      "data-checked:border-green-base data-checked:bg-green-base/5 data-checked:text-green-dark",
                      "**:data-[slot=radio-group-indicator]:hidden"
                    )}
                    value="INCOME"
                  >
                    <ArrowUpCircleIcon className="size-5" />
                    <span className="font-semibold text-xl">Receita</span>
                  </RadioGroupItem>
                </RadioGroup>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <FormInputController
            control={form.control}
            id="transaction-description"
            label="Descrição"
            name="description"
            placeholder="Ex. Almoço no restaurante"
            type="text"
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState }) => {
                const selectedDate = parseDateFromFormValue(field.value);

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="transaction-date-picker">Data</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        className={cn(
                          "flex h-12 w-full items-center justify-between rounded-[8px] border border-gray-300 px-3 font-normal text-base text-gray-800",
                          "focus-visible:border-brand-base focus-visible:ring-[3px] focus-visible:ring-brand-base/20",
                          "aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/20",
                          selectedDate ? "" : "text-gray-400"
                        )}
                        id="transaction-date-picker"
                        type="button"
                      >
                        <span className="truncate">
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                        </span>
                        <div className="flex items-center gap-2 text-gray-400">
                          <CalendarIcon className="size-4" />
                          <ChevronDownIcon className="size-4" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          locale={ptBR}
                          mode="single"
                          onSelect={(nextDate) => {
                            field.onChange(nextDate ? format(nextDate, "yyyy-MM-dd") : "");
                          }}
                          selected={selectedDate}
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                );
              }}
            />

            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-amount">Valor</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText className="font-medium text-gray-700">R$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-invalid={fieldState.invalid}
                      id="transaction-amount"
                      inputMode="decimal"
                      onBlur={() => {
                        setAmountDisplayValue(formatAmountValue(field.value));
                        field.onBlur();
                      }}
                      onChange={(event) => {
                        const nextDisplayValue = event.target.value.replace(/[^\d,]/g, "");
                        setAmountDisplayValue(nextDisplayValue);
                        field.onChange(parseAmountValue(nextDisplayValue));
                      }}
                      placeholder="0,00"
                      value={amountDisplayValue}
                    />
                  </InputGroup>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => {
              const selectedCategory = categoryOptions.find((categoryOption) => categoryOption.id === field.value);

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="h-12 w-full rounded-[8px] border-gray-300 bg-transparent px-3 text-base text-gray-800 data-placeholder:text-gray-400"
                      disabled={isLoadingCategoryOptions}
                      id="transaction-category"
                    >
                      <SelectValue placeholder="Selecione">{selectedCategory?.title ?? ""}</SelectValue>
                    </SelectTrigger>
                    <SelectContent align="start">
                      {categoryOptions.map((categoryOption) => (
                        <SelectItem key={categoryOption.id} value={categoryOption.id}>
                          {categoryOption.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              );
            }}
          />

          <Button className="mt-2 w-full" isLoading={isSubmitting} type="submit">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
