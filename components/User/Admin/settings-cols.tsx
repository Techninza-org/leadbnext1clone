import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadSchema } from "@/types/lead";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { TableColHeader } from "@/components/ui/table-header";
import { statuses } from "@/lib/table/table-utils";
import { useModal } from "@/hooks/use-modal-store";
import { format } from "date-fns";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const SettingsCols: ColumnDef<z.infer<any>>[] = [
    // {
    //     id: "id",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    // {
    //     header: 'ID',
    //     accessorKey: 'id',
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex items-center">
    //                 <span>{row.getValue("id")}</span>
    //             </div>
    //         )
    //     }
    // },
    {
        header: 'Root User',
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
        header: 'Plan',
        accessorKey: 'plan',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Select value={row.getValue("plan")} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Silver" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Silver">Silver</SelectItem>
                                <SelectItem value="Gold">Gold</SelectItem>
                                <SelectItem value="Platinum">Platinum</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )

        }
    },
    {
        header: 'Exchange',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Checkbox
                    checked={true}
                // checked={row.getValue("plan") === "Silver" || row.getValue("plan") === "Gold" || row.getValue("plan") === "Platinum"}
                // onCheckedChange={(value) => row.toggleSelected(!!value)}
                // aria-label="Select row"
            />
                </div>
            )
        }
    },
    {
        header: 'Document',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Checkbox
                    checked={true}
                // checked={row.getValue("plan") === "Silver" || row.getValue("plan") === "Gold" || row.getValue("plan") === "Platinum"}
                // onCheckedChange={(value) => row.toggleSelected(!!value)}
                // aria-label="Select row"
            />
                </div>
            )
        }
    },
    {
        header: 'Reporting',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Checkbox
                    checked={false}
                // checked={row.getValue("plan") === "Silver" || row.getValue("plan") === "Gold" || row.getValue("plan") === "Platinum"}
                // onCheckedChange={(value) => row.toggleSelected(!!value)}
                // aria-label="Select row"
            />
                </div>
            )
        }
    },
    {
        header: 'Payment',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Checkbox
                    checked={false}
                // checked={row.getValue("plan") === "Silver" || row.getValue("plan") === "Gold" || row.getValue("plan") === "Platinum"}
                // onCheckedChange={(value) => row.toggleSelected(!!value)}
                // aria-label="Select row"
            />
                </div>
            )
        }
    },
    
];
//onChange={(e) => row.setValue("plan", e.target.value)}