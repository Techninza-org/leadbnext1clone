"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteLeadProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
}

const DeleteLeadDialog = ({ id, name, onDelete }: DeleteLeadProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <button className="text-red-600 hover:text-red-800">
          Delete
        </button> */}
        {/* <Button size="icon" variant="ghost"> */}
          <Trash2 size={19} className="cursor-pointer text-red-600 hover:text-red-800" />
        {/* </Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Lead</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the lead ({name})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(id);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Define a type for the onDeleteLead function
type OnDeleteLeadFn = (id: string) => Promise<void>;

// Create a function that generates columns with the delete handler
export const createColumns = (onDeleteLead: OnDeleteLeadFn): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Lead Name",
  },
  {
    accessorKey: "date",
    header: "Lead Date",
  },
  {
    accessorKey: "assigned_to",
    header: "Assigned To",
  },
  {
    accessorKey: "status",
    header: "Lead Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === "new" ? "bg-blue-100 text-blue-800" :
            status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
            status === "completed" ? "bg-green-100 text-green-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {String(status).replace("_", " ")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus");
      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === "paid" ? "bg-green-100 text-green-800" :
            status === "pending" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {String(status)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <div className="flex items-center gap-2">
          {/* <button
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button> */}
          <DeleteLeadDialog 
            id={lead.id} 
            name={lead.name} 
            onDelete={onDeleteLead} 
          />
        </div>
      );
    },
  },
];
