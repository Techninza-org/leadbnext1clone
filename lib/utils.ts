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

export const downloadFile = (blobData: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blobData);
  // Create an anchor element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);

  // Append the anchor element to the body and click it
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const handleFileDownload = (fileName: string) => {
  const url = `/${fileName}`;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}

export function formatCurrencyForIndia(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return formatter.format(amount);
}