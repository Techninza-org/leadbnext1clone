"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";

interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  additionalDetails?: string;
}

interface ProspectsTableProps {
  data: Prospect[];
  setSelectedRows: any;
  selectedRows: any;
}

export default function ProspectsTable({ data, setSelectedRows, selectedRows }: ProspectsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { onOpen } = useModal()


  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectRow = (prospect: Prospect) => {
    setSelectedRows((prev: any) => {
      const { id } = prospect;
      const isSelected = !!prev[id];

      if (isSelected) {
        // Remove from selected rows
        const { [id]: _, ...remaining } = prev;
        return remaining;
      } else {
        // Add to selected rows
        return { ...prev, [id]: prospect };
      }
    });
  };

  const toggleSelectAll = () => {
    const allSelected = Object.keys(selectedRows).length === data.length;
    setSelectedRows(
      allSelected
        ? {}
        : Object.fromEntries(data.map((prospect) => [prospect.id, prospect]))
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">
              <input
                type="checkbox"
                checked={Object.keys(selectedRows).length === data?.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((prospect) => (
            <React.Fragment key={prospect.id}>
              <tr className="border-b">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selectedRows[prospect.id]}
                    onChange={() => toggleSelectRow(prospect)}
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => toggleRow(prospect.id)}
                    className="flex items-center space-x-2"
                  >
                    {expandedRows[prospect.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span
                      className="text-blue-900 cursor-pointer hover:underline"
                      // @ts-ignore
                      onClick={() => onOpen("viewLeadInfo", { lead: prospect })}>{prospect.name}
                    </span>
                  </button>
                </td>
                <td className="p-2 ">{prospect.email}</td>
                <td className="p-2 capitalize">{prospect.phone}</td>
                <td className="p-2 capitalize">{prospect.address}</td>
                <td className="p-2 capitalize">{prospect.city}</td>
                <td className="p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit Prospect</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Prospect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              {expandedRows[prospect.id] && (
                <tr className="border-b">
                  <td colSpan={7} className="p-0">
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        expandedRows[prospect.id] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="p-4 bg-gray-50">
                          <h4 className="font-medium mb-2">Additional Details</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            {prospect.additionalDetails || "No additional details available."}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit Details
                            </Button>
                            <Button variant="outline" size="sm">
                              View History
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}