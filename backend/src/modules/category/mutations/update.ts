import { GraphQLError } from "graphql";
import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../category.schema";
import {
  normalizeCategoryColor,
  normalizeCategoryDescription,
  normalizeCategoryIcon,
  normalizeCategoryTitle
} from "../category.validation";

type UpdateCategoryArgs = {
  id: string;
  input: {
    title?: string;
    description?: string | null;
    icon?: string;
    color?: string;
  };
};

export const updateCategoryMutation = async (
  _: unknown,
  { id, input }: UpdateCategoryArgs,
  context: GraphqlContext
) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const category = await context.prisma.category.findFirst({
    where: {
      id,
      userId: authenticatedUser.id
    }
  });

  if (!category) {
    throw new GraphQLError("Categoria não encontrada.", {
      extensions: {
        code: "NOT_FOUND"
      }
    });
  }

  const shouldUpdateTitle = input.title !== undefined;
  const shouldUpdateDescription = input.description !== undefined;
  const shouldUpdateIcon = input.icon !== undefined;
  const shouldUpdateColor = input.color !== undefined;

  if (!(shouldUpdateTitle || shouldUpdateDescription || shouldUpdateIcon || shouldUpdateColor)) {
    throw new GraphQLError("Informe pelo menos um campo para atualização.", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  const updatedCategory = await context.prisma.category.update({
    where: {
      id: category.id
    },
    data: {
      title: shouldUpdateTitle ? normalizeCategoryTitle(input.title ?? "") : undefined,
      description: shouldUpdateDescription ? normalizeCategoryDescription(input.description) : undefined,
      icon: shouldUpdateIcon ? normalizeCategoryIcon(input.icon ?? "") : undefined,
      color: shouldUpdateColor ? normalizeCategoryColor(input.color ?? "") : undefined
    }
  });

  return mapCategoryToResponse(updatedCategory);
};
