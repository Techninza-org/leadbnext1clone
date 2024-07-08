import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CallData {
  [key: string]: string;
}

export const formatFormData = (backendData: CallData[], formData: CallData) => {
  return backendData.map(field => {
    let value = formData[field.name]; // Get the value from formData based on field name

    // Adjust value or fieldType based on field type
    if (field.fieldType === "RADIO") {
      value = value === "yes" ? "Yes" : "No"; // Assuming "yes" or "no" values
    }

    return {
      name: field.name,
      fieldType: field.fieldType,
      value: value ? value : "",
    };
  });
};