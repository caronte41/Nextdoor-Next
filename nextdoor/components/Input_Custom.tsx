import * as React from "react";
import { cn } from "@/lib/utils";

// Extend the props for customization
export interface InputCustomProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label for the input
  errorMessage?: string; // Optional error message
}

const Input_Custom = React.forwardRef<HTMLInputElement, InputCustomProps>(
  ({ className, type = "text", label, errorMessage, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <span className="text-sm text-red-500">{errorMessage}</span>
        )}
      </div>
    );
  }
);

Input_Custom.displayName = "Input_Custom";

export { Input_Custom };
