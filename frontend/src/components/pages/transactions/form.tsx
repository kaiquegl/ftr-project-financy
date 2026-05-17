import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedValue } from "@/lib/debounce";
import {
  getTransactionCategoriesWithTransactionsOptionsQueryOptions,
  getTransactionPeriodsOptionsQueryOptions
} from "@/lib/graphql/transactions/queries";
import type { TransactionType } from "@/lib/graphql/transactions/schemas";

type TransactionsFiltersFormValues = {
  description: string;
  type: "ALL" | TransactionType;
  categoryId: string;
  period: string;
};

type TransactionsFiltersFormProps = {
  filters: TransactionsFiltersFormValues;
  onChange: (filters: TransactionsFiltersFormValues) => void;
};

const ALL_TYPES_VALUE = "ALL";
const ALL_CATEGORIES_VALUE = "ALL";
const CLEAR_PERIOD_VALUE = "__CLEAR_PERIOD__";

function formatPeriodLabel(periodValue: string): string {
  const [yearPart, monthPart] = periodValue.split("-");
  const parsedYear = Number(yearPart);
  const parsedMonth = Number(monthPart);

  if (!(Number.isInteger(parsedYear) && Number.isInteger(parsedMonth)) || parsedMonth < 1 || parsedMonth > 12) {
    return periodValue;
  }

  const periodDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
  const formattedPeriod = format(periodDate, "MMMM / yyyy", { locale: ptBR });

  return formattedPeriod.slice(0, 1).toUpperCase() + formattedPeriod.slice(1);
}

function getTypeLabel(typeValue: TransactionsFiltersFormValues["type"]): string {
  if (typeValue === "EXPENSE") {
    return "Saída";
  }

  if (typeValue === "INCOME") {
    return "Entrada";
  }

  return "Todos";
}

export function TransactionsFiltersForm({ filters, onChange }: TransactionsFiltersFormProps) {
  const { data: categories = [] } = useQuery(getTransactionCategoriesWithTransactionsOptionsQueryOptions());
  const { data: periodOptions = [] } = useQuery(getTransactionPeriodsOptionsQueryOptions());
  const [descriptionInputValue, setDescriptionInputValue] = useState(filters.description);
  const debouncedDescriptionInputValue = useDebouncedValue(descriptionInputValue, 300);
  const selectedCategoryLabel =
    filters.categoryId === ""
      ? "Todas"
      : (categories.find((categoryOption) => categoryOption.id === filters.categoryId)?.title ?? "Todas");
  const selectedPeriodLabel = filters.period === "" ? "Todos" : formatPeriodLabel(filters.period);

  useEffect(() => {
    setDescriptionInputValue(filters.description);
  }, [filters.description]);

  useEffect(() => {
    if (debouncedDescriptionInputValue === filters.description) {
      return;
    }

    onChange({
      ...filters,
      description: debouncedDescriptionInputValue
    });
  }, [debouncedDescriptionInputValue, filters, onChange]);

  return (
    <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-4 md:gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-gray-600 text-sm" htmlFor="transactions-filter-description">
          Buscar
        </label>
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-9"
            id="transactions-filter-description"
            onChange={(event) => {
              setDescriptionInputValue(event.target.value);
            }}
            placeholder="Buscar por descrição"
            value={descriptionInputValue}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-gray-600 text-sm" htmlFor="transactions-filter-type">
          Tipo
        </label>
        <Select
          onValueChange={(nextTypeValue) => {
            if (nextTypeValue === null) {
              return;
            }

            onChange({
              ...filters,
              type: nextTypeValue as TransactionsFiltersFormValues["type"]
            });
          }}
          value={filters.type}
        >
          <SelectTrigger
            className="h-12 w-full rounded-[8px] border-gray-300 bg-transparent px-3 text-base text-gray-800"
            id="transactions-filter-type"
          >
            <SelectValue>{getTypeLabel(filters.type)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_TYPES_VALUE}>Todos</SelectItem>
            <SelectItem value="EXPENSE">Saída</SelectItem>
            <SelectItem value="INCOME">Entrada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-gray-600 text-sm" htmlFor="transactions-filter-category">
          Categoria
        </label>
        <Select
          onValueChange={(nextCategoryId) => {
            if (nextCategoryId === null) {
              return;
            }

            onChange({
              ...filters,
              categoryId: nextCategoryId === ALL_CATEGORIES_VALUE ? "" : nextCategoryId
            });
          }}
          value={filters.categoryId === "" ? ALL_CATEGORIES_VALUE : filters.categoryId}
        >
          <SelectTrigger
            className="h-12 w-full rounded-[8px] border-gray-300 bg-transparent px-3 text-base text-gray-800"
            id="transactions-filter-category"
          >
            <SelectValue>{selectedCategoryLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_CATEGORIES_VALUE}>Todas</SelectItem>
            {categories.map((categoryOption) => (
              <SelectItem key={categoryOption.id} value={categoryOption.id}>
                {categoryOption.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-gray-600 text-sm" htmlFor="transactions-filter-period">
          Período
        </label>
        <Select
          onValueChange={(nextPeriodValue) => {
            if (nextPeriodValue === null) {
              return;
            }

            onChange({
              ...filters,
              period: nextPeriodValue === CLEAR_PERIOD_VALUE ? "" : nextPeriodValue
            });
          }}
          value={filters.period === "" ? undefined : filters.period}
        >
          <SelectTrigger
            className="h-12 w-full rounded-[8px] border-gray-300 bg-transparent px-3 text-base text-gray-800"
            id="transactions-filter-period"
          >
            <SelectValue>{selectedPeriodLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={CLEAR_PERIOD_VALUE}>Todos</SelectItem>
            {periodOptions.map((periodOption) => (
              <SelectItem key={periodOption} value={periodOption}>
                {formatPeriodLabel(periodOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export type { TransactionsFiltersFormValues };
