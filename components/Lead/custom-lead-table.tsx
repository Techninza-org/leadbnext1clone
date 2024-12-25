"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal, PencilLineIcon } from "lucide-react";
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

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  additionalDetails?: string;
}

interface LeadsTableProps {
  data: Lead[];
  setSelectedRows: any;
  selectedRows: any;
}

export default function LeadsTable({ data, setSelectedRows, selectedRows }: LeadsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { onOpen } = useModal()


  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectRow = (Lead: Lead) => {
    setSelectedRows((prev: any) => {
      const { id } = Lead;
      const isSelected = !!prev[id];

      if (isSelected) {
        // Remove from selected rows
        const { [id]: _, ...remaining } = prev;
        return remaining;
      } else {
        // Add to selected rows
        return { ...prev, [id]: Lead };
      }
    });
  };

  const toggleSelectAll = () => {
    const allSelected = Object.keys(selectedRows).length === data.length;
    setSelectedRows(
      allSelected
        ? {}
        : Object.fromEntries(data.map((Lead) => [Lead.id, Lead]))
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
          {data?.map((lead: any) => (
            <React.Fragment key={lead.id}>
              <tr className="border-b">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selectedRows[lead.id]}
                    onChange={() => toggleSelectRow(lead)}
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => toggleRow(lead.id)}
                    className="flex items-center space-x-2"
                  >
                    {expandedRows[lead.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span
                      className="text-blue-900 cursor-pointer hover:underline"
                      onClick={() => onOpen("viewLeadInfo", { lead })}>{lead.name}
                    </span>
                  </button>
                </td>
                <td className="p-2 ">{lead.email}</td>
                <td className="p-2 capitalize">{lead.phone}</td>
                <td className="p-2 capitalize">{lead.address}</td>
                <td className="p-2 capitalize">{lead.city}</td>
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
                      <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Lead
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              {expandedRows[lead.id] && (
                <tr className="border-b ml-5">
                  <td colSpan={7} className="p-0">
                    <div
                      className={cn(
                        "grid transition-all px-5 duration-300 ease-in-out",
                        expandedRows[lead.id] ? " grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      {lead.submittedForm.map((item: any) => {
                        return item.dependentOnValue.map((field: any) => (
                          <>
                            <h1 className="text-lg font-bold my-3 items-center flex">{item.dependentOnFormName}
                              <Button
                                variant={'ghost'}
                                size={'icon'}
                                onClick={() => onOpen("editLeadFormValue", { fields: { id: item.id, name: item.dependentOnFormName, fields: [field]} })}
                              >
                                <PencilLineIcon size={20} />
                              </Button>
                            </h1>
                            <table className="w-full bg-gray-50 border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-2 text-left">Name</th>
                                  <th className="p-2 text-left">Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr key={field.id} className="border-b">
                                  <td className="p-2">{field.name}</td>
                                  <td className="p-2">{field.value}</td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        ));
                      })}
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