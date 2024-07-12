import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadSchema } from "@/types/lead";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import ActionTooltip from "../action-tooltip";
import { MANAGER } from "@/lib/role-constant";

export const LeadColDefs: ColumnDef<z.infer<typeof leadSchema>>[] = [
    {
        id: "id",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("name")}</span>
                </div>
            )

        }
    },
    {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("email")}</span>
                </div>
            )

        }
    },
    {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("phone")}</span>
                </div>
            )

        }
    },
    {
        header: 'Address',
        accessorKey: 'address',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("address")}</span>
                </div>
            )

        }
    },
    {
        header: 'City',
        accessorKey: 'city',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("city")}</span>
                </div>
            )
        }
    },
    {
        header: 'Assignee',
        accessorKey: '',
        cell: ({ row }) => {
            const rowData = row?.original;
            const assigneeName = rowData?.LeadMember?.map((leadMember) => leadMember?.Member?.name).join(", ");
            const isAssigned = [MANAGER, "company"].includes(assigneeName?.toLowerCase());

            return (
                <ActionTooltip label={assigneeName || "Awaited"} align="center" side="top" key={"assignedMembers"}>
                    <Button
                        size={'sm'}
                        variant={isAssigned ? "destructive" : "secondary"}
                        className="text-xs p-2  capitalize"
                    >
                        {isAssigned ? "Not Assigned" : "Assigned"}
                    </Button>
                </ActionTooltip>
            );
        }
    }

];