import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface RsInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currencySymbol?: string; // Default is ₹
}

const RsInput = React.forwardRef<HTMLInputElement, RsInputProps>(
  ({ className, currencySymbol = "₹", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots
      e.target.value = value; // Update the value to be clean
      if (props.onChange) props.onChange(e); // Call the parent's onChange handler
    };

    return (
      <div
        className={cn(
          "relative flex items-center w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <span className="absolute left-3 text-muted-foreground">{currencySymbol}</span>
         <Input
          type="number"
          onChange={handleChange}
          ref={ref}
          className={" pl-7  flex-1 bg-transparent text-sm focus:outline-none  focus-visible:ring-0 text-black focus-visible:ring-offset-0"}
          {...props}
        />
      </div>
    );
  }
);

RsInput.displayName = "RsInput";

export { RsInput };
