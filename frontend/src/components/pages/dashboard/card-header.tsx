import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyToBr } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type DashboardCardHeaderTone = "balance" | "income" | "expense";

type DashboardCardHeaderProps = {
  title: string;
  amount: number;
  icon: LucideIcon;
  tone: DashboardCardHeaderTone;
};

const toneClasses: Record<DashboardCardHeaderTone, string> = {
  balance: "text-purple-base",
  income: "text-brand-base",
  expense: "text-red-base"
};

export function DashboardCardHeader({ title, amount, icon: Icon, tone }: DashboardCardHeaderProps) {
  return (
    <Card className="py-0">
      <CardContent className="flex flex-col items-start justify-between gap-3 p-4 md:gap-4 md:p-5">
        <div className="inline-flex items-center gap-2 md:gap-3">
          <Icon className={cn("size-5", toneClasses[tone])} />
          <span className="font-medium text-gray-500 text-xs uppercase leading-tight tracking-[0.12em]">{title}</span>
        </div>
        <p className="font-bold text-gray-800 text-xl leading-tight lg:text-3xl">{formatCurrencyToBr(amount)}</p>
      </CardContent>
    </Card>
  );
}
