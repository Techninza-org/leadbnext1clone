import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadBidsSchema, leadSchema } from "@/types/lead";
import { formatCurrencyForIndia } from "@/lib/utils";

export const BidsColDefs: ColumnDef<z.infer<typeof leadBidsSchema>>[] = [
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
        header: 'Remark',
        accessorKey: 'remark',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("remark")}</div>
            )
        }
    },
    {
        header: 'Next FollowUp Date',
        accessorKey: 'nextFollowUpDate',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("nextFollowUpDate")}</div>
            )
        }
    },
    {
        header: 'Followup By',
        accessorKey: 'followUpBy',
        cell: ({ row }) => {
            const member: { name: string } = row.getValue("followUpBy");
            return (
                <div className="capitalize">{member.name}</div>
            )
        }
    },
    {
        header: 'Type',
        accessorKey: 'customerResponse',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("customerResponse")}</div>
            )
        }
    },

];