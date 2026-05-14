import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      className={cn(
        "h-12 w-full min-w-0 rounded-[8px] border border-gray-300 bg-transparent px-3 py-[14px] text-base text-gray-800 shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-gray-400 focus-visible:border-brand-base focus-visible:ring-[3px] focus-visible:ring-brand-base/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/20 dark:bg-input/30 dark:aria-invalid:border-danger dark:aria-invalid:ring-danger/40",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
