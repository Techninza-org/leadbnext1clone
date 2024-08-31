import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const CompaniesListCol: ColumnDef<z.infer<any>>[] = [
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
    {
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("id")}</span>
                </div>
            )
        }
    },
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
        header: 'Company Name',
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
        header: 'Contact',
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
                <HoverCardToolTip label="Details" >
                    <p>Address: </p>
                    <p>Email: </p>
                </HoverCardToolTip>
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
    }
];
//onChange={(e) => row.setValue("plan", e.target.value)}