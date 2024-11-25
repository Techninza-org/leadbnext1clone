import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultCountryCode?: string; // Default country code (e.g., +1)
  onCountryChange?: (countryCode: string) => void; // Callback for country code change
}

const countryCodes = [
  { code: "+1", label: "US" },
  { code: "+91", label: "IN" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "AU" },
];

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, defaultCountryCode = "+1", onCountryChange, ...props }, ref) => {
    const [selectedCode, setSelectedCode] = React.useState(defaultCountryCode);

    const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const code = e.target.value;
      setSelectedCode(code);
      onCountryChange?.(code);
    };

    return (
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-input bg-background px-2 py-1 text-sm  focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0",
          className
        )}
      >
        <div>+91</div>
        <Input
          type="number"
          ref={ref}
          maxLength={10}
          className={"flex-1 bg-transparent text-sm focus:outline-none  focus-visible:ring-0 text-black focus-visible:ring-offset-0"}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
