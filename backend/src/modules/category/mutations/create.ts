import { requireAuthenticatedUser } from "../../../lib/auth";
import type { GraphqlContext } from "../../../lib/graphql-context";
import { mapCategoryToResponse } from "../category.schema";
import {
  normalizeCategoryColor,
  normalizeCategoryDescription,
  normalizeCategoryIcon,
  normalizeCategoryTitle
} from "../category.validation";

type CreateCategoryArgs = {
  input: {
    title: string;
    description?: string | null;
    icon: string;
    color: string;
  };
};

export const createCategoryMutation = async (_: unknown, { input }: CreateCategoryArgs, context: GraphqlContext) => {
  const authenticatedUser = requireAuthenticatedUser(context);

  const createdCategory = await context.prisma.category.create({
    data: {
      title: normalizeCategoryTitle(input.title),
      description: normalizeCategoryDescription(input.description),
      icon: normalizeCategoryIcon(input.icon),
      color: normalizeCategoryColor(input.color),
      userId: authenticatedUser.id
    }
  });

  return mapCategoryToResponse(createdCategory);
};
