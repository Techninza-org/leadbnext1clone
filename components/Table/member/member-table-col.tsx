import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { createCompanyMemberSchema } from "@/types/auth";
import Link from "next/link";
import { PenLineIcon } from "lucide-react";

export const MemberColDefs: ColumnDef<z.infer<typeof createCompanyMemberSchema>>[] = [
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
        header: 'Role',
        accessorKey: 'role',
        cell: ({ row }) => {
            const role = row.getValue("role") as { name: string };
            const roleName = role ? role.name : '';
            return (
                <div className="flex items-center">
                    <span>{roleName}</span>
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
        header: '',
        accessorKey: 'id',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Link href={`/members/assign/${row.getValue("id")}`}><PenLineIcon size={18} /></Link>
                </div>
            )

        }
    },
];
