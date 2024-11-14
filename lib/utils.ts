import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CallData {
  [key: string]: string;
}

export const formatFormData = (backendData: CallData[], formData: CallData) => {
  return backendData.map(field => {
    let value = formData[field.name];

    if (field.fieldType === "RADIO") {
      value = value === "yes" ? "Yes" : "No";
    }

    if (field.fieldType === "IMAGE") {
      return {
        name: field.name,
        fieldType: field.fieldType,
        value: Array.isArray(field.value) ? field.value : [field.value]
      };
    }

    if (field.fieldType === "DD_IMG") {
      return {
        name: field.name,
        fieldType: field.fieldType,
        value: Array.isArray(field.value) ? field.value : [field.value]
      };
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