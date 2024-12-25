import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadBidsSchema, leadSchema } from "@/types/lead";
import { formatCurrencyForIndia } from "@/lib/utils";
import { format } from "date-fns";

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
        header: 'Id',
        accessorKey: 'id',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("id")}</div>
            )
        }
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
        header: 'Followup By',
        accessorKey: 'followUpBy',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("followUpBy")}</div>
            )
        }
    },
    // {
    //     header: 'Date',
    //     accessorKey: 'createdAt',
    //     cell: ({ row }) => {
    //         return (
    //             // <div className="capitalize">{format(new Date(row.getValue("createdAt")), "DD MM YYYY")}</div>
    //             <div className="capitalize">{(row.getValue("createdAt"))}</div>
    //         )
    //     }
    // },
    {
        header: 'Next FollowUp Date',
        accessorKey: 'nextFollowUpDate',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.getValue("nextFollowUpDate")}</div>
            )
        }
    },
];