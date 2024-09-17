import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import Link from "next/link";

export const CompaniesListCol: ColumnDef<z.infer<any>>[] = [
    {
        header: 'Company ID',
        cell: ({ row }) => {
            const id = row.original.Company.id;
            return (
                <div className="flex items-center">
                    <Link href={`/admin/dept/${id}`} className="ml-2 text-blue-800">
                        <span>{id}</span>
                    </ Link >
                </div>
            )
        }
    },
    {
        header: 'Company Name',
        cell: ({ row }) => {
            const id = row.original.Company.name;
            return (
                <div className="flex items-center">
                    <span>{id}</span>
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
        header: 'Details',
        cell: ({ row }) => {
            const email = row.original.Company.email
            const phone = row.original.Company.phone
            return (
                <HoverCardToolTip label="Details" >
                    <p>Email: {email}</p>
                    <p>Phone: {phone}</p>
                </HoverCardToolTip>
            )
        }
    },
    {
        header: 'Plan',
        accessorKey: 'Subscriptions',
        cell: ({ row }) => {
            if(row.original.Company.Subscriptions.length === 0) return <span>No Plan</span>
            const length = row.original.Company.Subscriptions.length;
            const sub = row.original.Company.Subscriptions[length -1]
            return (
                <div className="flex items-center">
                    <span>{sub.plan.name}</span>
                </div>
            )

        }
    }
];