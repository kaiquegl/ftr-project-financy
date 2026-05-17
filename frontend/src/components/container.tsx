import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return <div className={cn("container mx-auto px-2 md:px-4 xl:max-w-7xl", className)}>{children}</div>;
}
