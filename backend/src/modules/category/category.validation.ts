import { GraphQLError } from "graphql";

const CATEGORY_ICON_TOKENS = new Set([
  "briefcase-business",
  "car-front",
  "heart-pulse",
  "piggy-bank",
  "shopping-cart",
  "ticket",
  "tool-case",
  "utensils",
  "paw-print",
  "house",
  "gift",
  "dumbbell",
  "book-open",
  "baggage-claim",
  "mailbox",
  "receipt-text"
]);

const CATEGORY_COLOR_TOKENS = new Set(["green", "blue", "purple", "pink", "red", "orange", "yellow"]);

const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 180;

function invalidCategoryInputError(message: string) {
  return new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT"
    }
  });
}

export function normalizeCategoryTitle(title: string): string {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw invalidCategoryInputError("Informe um título para a categoria.");
  }

  if (normalizedTitle.length > MAX_TITLE_LENGTH) {
    throw invalidCategoryInputError(`O título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres.`);
  }

  return normalizedTitle;
}

export function normalizeCategoryDescription(description: string | null | undefined): string | null {
  if (!description) {
    return null;
  }

  const normalizedDescription = description.trim();
  if (!normalizedDescription) {
    return null;
  }

  if (normalizedDescription.length > MAX_DESCRIPTION_LENGTH) {
    throw invalidCategoryInputError(`A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`);
  }

  return normalizedDescription;
}

export function normalizeCategoryIcon(icon: string): string {
  const normalizedIcon = icon.trim();
  if (!CATEGORY_ICON_TOKENS.has(normalizedIcon)) {
    throw invalidCategoryInputError("Ícone de categoria inválido.");
  }

  return normalizedIcon;
}

export function normalizeCategoryColor(color: string): string {
  const normalizedColor = color.trim();
  if (!CATEGORY_COLOR_TOKENS.has(normalizedColor)) {
    throw invalidCategoryInputError("Cor de categoria inválida.");
  }

  return normalizedColor;
}
