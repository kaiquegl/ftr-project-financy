import { Card, CardContent } from "@/components/ui/card";

type CategoriesCardHeaderProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function CategoriesCardHeader({ title, description, icon }: CategoriesCardHeaderProps) {
  return (
    <Card>
      <CardContent className="flex gap-2 md:gap-4">
        {icon}
        <div className="flex flex-1 flex-col gap-1 md:gap-2">
          <span className="font-bold text-gray-800 text-xl leading-none md:text-3xl">{title}</span>
          <p className="font-medium text-[0.625rem] text-gray-500 uppercase leading-tight md:text-xs">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
