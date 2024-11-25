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

interface ParsedData {
  [key: string]: string | number;
}

export const parseCSVToJson = async (file: File) => {
  const fileContent = await file.text();
  const lines = fileContent.split("\n").map(line => line.trim());

  if (lines.length === 0) {
    throw new Error("The CSV file is empty.");
  }

  const headers = lines[0].split(",").map(header => header.trim());

  const jsonData: ParsedData[] = lines.slice(1).map(line => {
    const values = line.split(",").map(value => value.trim());
    const row: ParsedData = {};

    headers.forEach((header, index) => {
      row[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
    });

    return row;
  });

  return {jsonData, headers};
};

export const generateCSV = (data: any): void => {
  const header = data?.map((item: any) => item.name).join(",") + "\n";

  const blob = new Blob([header], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "headers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
