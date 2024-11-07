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
        header: 'Customer Name',
        accessorKey: 'lead',
        cell: ({ row }) => {
            const rowData = row.original;
            
            return (
                <div className="capitalize">{rowData.lead.name}</div>
            )
        }
    },
    {
        header: 'Bid Amount',
        accessorKey: 'bidAmount',
        cell: ({ row }) => {
            return (
                <div>{formatCurrencyForIndia(row.getValue("bidAmount") || 0)}</div>
            )
        }
    },
    {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("description")}</div>
            )
        }
    },
    {
        header: 'Bidder Name',
        accessorKey: 'Member',
        cell: ({ row }) => {
            const member: { name: string } = row.getValue("Member");
            return (
                <div className="capitalize">{member.name}</div>
            )
        }
    },
    {
        header: 'Approved',
        accessorKey: 'isApproved',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("isApproved") ? "Yes": "No"}</div>
            )
        }
    },

];