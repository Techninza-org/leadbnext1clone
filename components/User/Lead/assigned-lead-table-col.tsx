import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadSchema } from "@/types/lead";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { TableColHeader } from "@/components/ui/table-header";
import { statuses } from "@/lib/table/table-utils";
import { AssignedLeadTableRowActions } from "./assigned-lead-row-action";
import { useModal } from "@/hooks/use-modal-store";
import { format, formatDate } from "date-fns";


export const AssignedLeadColDefs: ColumnDef<z.infer<typeof leadSchema>>[] = [
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
                <EnquiryDetailsLead lead={row.original} />
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
        header: 'Customer No.',
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
        header: 'Company Name.',
        accessorKey: 'dynamicFieldValues',
        cell: ({ row }) => {
            // @ts-ignore
            const companyName = row.original?.dynamicFieldValues?.find(x => x.name == "Company Name")?.value
            return (
                <div className="flex items-center">
                    <span>{companyName}</span>
                </div>
            )

        }
    },
    {
        header: 'Company Address.',
        accessorKey: 'dynamicFieldValues',
        cell: ({ row }) => {
            // @ts-ignore
            const companyName = row.original?.dynamicFieldValues?.find(x => x.name == "Company Address")?.value
            return (
                <div className="flex items-center">
                    <span>{companyName}</span>
                </div>
            )

        }
    },
    {
        header: 'City.',
        accessorKey: 'dynamicFieldValues',
        cell: ({ row }) => {
            // @ts-ignore
            const companyName = row.original?.dynamicFieldValues?.find(x => x.name == "City")?.value
            return (
                <div className="flex items-center">
                    <span>{companyName}</span>
                </div>
            )

        }
    },
    // {
    //     header: "Call Status",
    //     accessorKey: 'callStatus',
    //     enableSorting: true,
    //     cell: ({ row }) => {

    //         return (
    //             <div className="flex text-xs items-center">
    //                 <Badge
    //                     // variant={callStatus.toLowerCase() as any}
    //                     className="capitalize"
    //                 >
    //                     {row.getValue("callStatus")}
    //                 </Badge>
    //             </div>
    //         )
    //     },
    // },
    {
        header: "Next Follow Up",
        accessorKey: 'nextFollowUpDate',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("nextFollowUpDate")}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <AssignedLeadTableRowActions lead={row.original} />,
    },
];

export const AssignedProspectColDefs: ColumnDef<z.infer<typeof leadSchema>>[] = [
    {
        id: "id",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
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
                <EnquiryDetailProspect lead={row.original} />
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
        header: 'Customer No.',
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
        header: 'Company Name.',
        accessorKey: 'dynamicFieldValues',
        cell: ({ row }) => {
            // @ts-ignore
            const companyName = row.original?.dynamicFieldValues?.find(x => x.name == "Company Name")?.value
            return (
                <div className="flex items-center">
                    <span>{companyName}</span>
                </div>
            )

        }
    },
    {
        header: 'Company Address.',
        accessorKey: 'dynamicFieldValues',
        cell: ({ row }) => {
            // @ts-ignore
            const companyName = row.original?.dynamicFieldValues?.find(x => x.name == "Company Address")?.value
            return (
                <div className="flex items-center">
                    <span>{companyName}</span>
                </div>
            )

        }
    },
    {
        header: 'City.',
        accessorKey: 'dynamicFieldValues',
        cell: ({ row }) => {
            // @ts-ignore
            const companyName = row.original?.dynamicFieldValues?.find(x => x.name == "City")?.value
            return (
                <div className="flex items-center">
                    <span>{companyName}</span>
                </div>
            )

        }
    },
    // {
    //     header: "Call Status",
    //     accessorKey: 'callStatus',
    //     enableSorting: true,
    //     cell: ({ row }) => {

    //         return (
    //             <div className="flex text-xs items-center">
    //                 <Badge
    //                     // variant={callStatus.toLowerCase() as any}
    //                     className="capitalize"
    //                 >
    //                     {row.getValue("callStatus")}
    //                 </Badge>
    //             </div>
    //         )
    //     },
    // },
    {
        header: "Next Follow Up",
        accessorKey: 'nextFollowUpDate',
        cell: ({ row }) => {
            // @ts-ignore
            const nextDate = row.original?.followUps?.[row?.original?.followUps?.length - 1]?.nextFollowUpDate
            return (
                <div className="flex items-center">
                    <span>{nextDate ? formatDate(nextDate, "dd/MM/yyyy") : ""}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <AssignedLeadTableRowActions lead={row.original} />,
    },
];


const EnquiryDetailsLead = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const { onOpen } = useModal()
    const isConverted = lead?.approvedToClient
    return (
        <div className="flex items-center">
            <span
                className={!isConverted ? 'text-blue-900 cursor-pointer hover:underline' : 'text-red-500 hover:underline'}
                onClick={() => onOpen("enquiryDetailsLead", { lead, query: "Lead" })}>{lead.id}</span>
        </div>
    )
}
const EnquiryDetailProspect = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const { onOpen } = useModal()
    const isTransfered = lead?.isLeadConverted 
    return (
        <div className="flex items-center">
            <span
                className={!isTransfered ? 'text-blue-900 cursor-pointer hover:underline' : 'text-red-500 hover:underline'}
                onClick={() => onOpen("enquiryDetailsProspect", { lead, query: "Prospect" })}>{lead.id}</span>
        </div>
    )
}