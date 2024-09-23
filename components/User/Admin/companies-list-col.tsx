import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import HoverCardToolTip from "@/components/hover-card-tooltip";
import Link from "next/link";
import { CompanyPlan } from "./update-plan";

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
                <span>{id}</span>
            )
        }
    },
    {
        header: 'Owner User',
        accessorKey: 'name',
        cell: ({ row }) => {
            return (
                <span>{row.getValue("name")}</span>
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
            return (
                <div className="w-20">
                    <CompanyPlan row={row.original} />
                </div>
            )

        }
    }
];
