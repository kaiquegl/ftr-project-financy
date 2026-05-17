import { getCategoryBgClass, getCategoryNameColorClass } from "@/lib/graphql/categories/helpers";
import { cn } from "@/lib/utils";

type CategoriesNameBadgeProps = {
  title: string;
  color: string;
};

export function CategoriesNameBadge({ title, color }: CategoriesNameBadgeProps) {
  const colorClass = getCategoryNameColorClass(color);
  const bgClass = getCategoryBgClass(color);

  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full px-3 py-1 pb-1.5 font-medium text-xs leading-none md:text-sm",
        colorClass,
        bgClass
      )}
    >
      {title}
    </span>
  );
}
