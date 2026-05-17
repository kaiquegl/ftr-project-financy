import {
  getCategoryBgClass,
  getCategoryIconByToken,
  getCategoryIconColorClass
} from "@/lib/graphql/categories/helpers";
import { cn } from "@/lib/utils";

type CategoriesIconBadgeProps = {
  icon: string;
  color: string;
};

export function CategoriesIconBadge({ icon, color }: CategoriesIconBadgeProps) {
  const Icon = getCategoryIconByToken(icon);
  const bgClass = getCategoryBgClass(color);
  const colorClass = getCategoryIconColorClass(color);

  return (
    <span className={cn("flex size-6 items-center justify-center rounded-[8px] md:size-10", colorClass, bgClass)}>
      <Icon className="size-3 md:size-4" />
    </span>
  );
}
