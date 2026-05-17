import { GraphQLError } from "graphql";

const MAX_DESCRIPTION_LENGTH = 180;
const PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const PERIOD_PARTS_LENGTH = 2;
const YEAR_INDEX = 0;
const MONTH_INDEX = 1;
const MONTH_OFFSET = 1;
const MIN_PAGE = 1;
const MIN_PER_PAGE = 1;
const MAX_PER_PAGE = 100;

function invalidTransactionInputError(message: string) {
  return new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT"
    }
  });
}

export function normalizeTransactionDescription(description: string): string {
  const normalizedDescription = description.trim();

  if (!normalizedDescription) {
    throw invalidTransactionInputError("Informe uma descrição para a transação.");
  }

  if (normalizedDescription.length > MAX_DESCRIPTION_LENGTH) {
    throw invalidTransactionInputError(`A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`);
  }

  return normalizedDescription;
}

export function normalizeOptionalTransactionDescription(description: string | null | undefined): string | undefined {
  if (description === undefined) {
    return;
  }

  return normalizeTransactionDescription(description ?? "");
}

export function normalizeTransactionAmount(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw invalidTransactionInputError("Informe um valor válido para a transação.");
  }

  if (amount <= 0) {
    throw invalidTransactionInputError("O valor da transação deve ser maior que zero.");
  }

  return amount;
}

export function normalizeOptionalTransactionAmount(amount: number | null | undefined): number | undefined {
  if (amount === undefined) {
    return;
  }

  return normalizeTransactionAmount(amount ?? Number.NaN);
}

export function normalizeTransactionDate(dateValue: string): Date {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    throw invalidTransactionInputError("Informe uma data válida para a transação.");
  }

  return parsedDate;
}

export function normalizeOptionalTransactionDate(dateValue: string | null | undefined): Date | undefined {
  if (dateValue === undefined) {
    return;
  }

  return normalizeTransactionDate(dateValue ?? "");
}

export function normalizeOptionalPeriod(period: string | null | undefined): string | undefined {
  if (period === undefined || period === null) {
    return;
  }

  const normalizedPeriod = period.trim();
  if (!normalizedPeriod) {
    return;
  }

  if (!PERIOD_PATTERN.test(normalizedPeriod)) {
    throw invalidTransactionInputError("Período inválido. Use o formato YYYY-MM.");
  }

  return normalizedPeriod;
}

export function resolvePeriodRange(period: string): { startDate: Date; endDate: Date } {
  const parts = period.split("-");

  if (parts.length !== PERIOD_PARTS_LENGTH) {
    throw invalidTransactionInputError("Período inválido. Use o formato YYYY-MM.");
  }

  const year = Number(parts[YEAR_INDEX]);
  const month = Number(parts[MONTH_INDEX]);

  if (!(Number.isInteger(year) && Number.isInteger(month))) {
    throw invalidTransactionInputError("Período inválido. Use o formato YYYY-MM.");
  }

  const startDate = new Date(Date.UTC(year, month - MONTH_OFFSET, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  return {
    startDate,
    endDate
  };
}

export function normalizePage(page: number | null | undefined): number {
  if (page === undefined || page === null) {
    return MIN_PAGE;
  }

  if (!Number.isInteger(page) || page < MIN_PAGE) {
    throw invalidTransactionInputError("Número de página inválido.");
  }

  return page;
}

export function normalizePerPage(perPage: number | null | undefined): number {
  if (perPage === undefined || perPage === null) {
    return 10;
  }

  if (!Number.isInteger(perPage) || perPage < MIN_PER_PAGE || perPage > MAX_PER_PAGE) {
    throw invalidTransactionInputError(`A quantidade por página deve estar entre ${MIN_PER_PAGE} e ${MAX_PER_PAGE}.`);
  }

  return perPage;
}
