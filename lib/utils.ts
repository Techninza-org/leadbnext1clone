import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CallData {
  [key: string]: string;
}

export const formatFormData = (backendData: CallData | CallData[], formData: CallData) => {
  const formatField = (field: CallData) => {
    let value = formData[field.name];

    if (field.fieldType === "RADIO") {
      value = value === "yes" ? "Yes" : "No";
    }

    if (field.fieldType === "IMAGE" || field.fieldType === "DD_IMG") {
      return {
        name: field.name,
        fieldType: field.fieldType,
        value: Array.isArray(value) ? value : [value]
      };
    }

    return {
      name: field.name,
      fieldType: field.fieldType,
      value: value === "" ? { value: "" } : (value || ""),
    };
  };

  if (Array.isArray(backendData)) {
    return backendData.map(formatField);
  } else {
    return formatField(backendData);
  }
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

  return { jsonData, headers };
};

export const generateCSV = (data: any, fileName: string): void => {
  const header = data?.map((item: any) => item.name).join(",") + "\n";

  const blob = new Blob([header], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateCSVFromJson = (data: any, fileName: string): void => {
  const header = Object.keys(data[0]).join(",") + "\n";
  const rows = data.map((item: any) => Object.values(item).join(",")).join("\n");

  const blob = new Blob([header, rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface Field {
  name: string;
  fieldType: string;
  ddOptionId: string | null;
  options: any | null;
  isDisabled: boolean;
  isRequired: boolean;
  imgLimit: number | null;
  order: number;
}

// Interface for field relationships
interface FieldRelationship {
  [key: string]: Field[];
}

// Interface for data items
interface DataItem {
  id: string;
  name: string;
  dependentOnId: string;
  childName?: string;
  fields: Field[] | FieldRelationship;
}

export function updateDependentFields(data: DataItem[]): DataItem[] {
  // Create a map for quick lookup
  const nameToItemMap: Record<string, DataItem> = {};
  data.forEach(item => {
    nameToItemMap[item.name.trim()] = item;
  });

  // Process each item to establish relationships
  data.forEach(item => {
    if (item.dependentOnId) {
      const parentName = item.dependentOnId.trim();
      const parent = nameToItemMap[parentName];

      if (parent) {
        // Convert parent's fields to relationship object if it's an array
        if (Array.isArray(parent.fields)) {
          parent.fields = {
            [parent.name.trim()]: parent.fields
          } as FieldRelationship;
        }

        // Get the existing relationships from parent
        const parentRelationships: FieldRelationship = { ...parent.fields as FieldRelationship };

        // If the current item has a child, merge its relationships
        if (item.fields && !Array.isArray(item.fields)) {
          // Merge existing relationships from item
          Object.assign(parentRelationships, item.fields);
        }

        // Add current item's fields
        if (Array.isArray(item.fields)) {
          parentRelationships[item.name.trim()] = item.fields;
        }

        // Update parent's fields with all relationships
        parent.fields = parentRelationships;

        // Set child name on parent
        parent.childName = item.name.trim();

        if (nameToItemMap[item.name.trim()]) {
          const currentItem = nameToItemMap[item.name.trim()];
          // Not required for now: as it updating the child fields

          // if (Array.isArray(currentItem.fields)) {
          //   currentItem.fields = {
          //     [item.name.trim()]: currentItem.fields,
          //     ...(item.fields as FieldRelationship)
          //   } as FieldRelationship;
          // }
        }
      }
    }
  });

  return data;
}
