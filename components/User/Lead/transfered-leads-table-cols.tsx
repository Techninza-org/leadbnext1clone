import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadSchema } from "@/types/lead";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { TableColHeader } from "@/components/ui/table-header";
import { statuses } from "@/lib/table/table-utils";
import { AssignedLeadTableRowActions } from "./assigned-lead-row-action";
import { useModal } from "@/hooks/use-modal-store";
import { format } from "date-fns";


export const TransferedLeadColDefs: ColumnDef<z.infer<any>>[] = [
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
        header: 'Enquiry ID',
        accessorKey: 'id',
        cell: ({ row }) => {
            return (
                <span>{row.getValue("id")}</span>
            )
        }
    },
    {
        header: 'Customer Name',
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
        header: 'Transferred By',
        accessorKey: 'transferBy',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.original.LeadTransferTo[0].transferBy.name} - {row.original.LeadTransferTo[0].transferBy.role?.name}</span>
                </div>
            )
        }
    },
    {
        header: 'Transferred To',
        accessorKey: 'transferTo',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.original.LeadTransferTo[0].transferTo.name} - {row.original.LeadTransferTo[0].transferTo.role?.name}</span>
                </div>
            )
        }
    }
];
