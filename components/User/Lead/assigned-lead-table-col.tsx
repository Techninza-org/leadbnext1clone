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
                <EnquiryDetails lead={row.original} />
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
    // {
    //     header: 'Email',
    //     accessorKey: 'email',
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex items-center">
    //                 <span>{row.getValue("email")}</span>
    //             </div>
    //         )

    //     }
    // },
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
    // {
    //     header: 'Address',
    //     accessorKey: 'address',
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex items-center">
    //                 <span>{row.getValue("address")}</span>
    //             </div>
    //         )

    //     }
    // },
    // {
    //     header: 'City',
    //     accessorKey: 'city',
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex items-center">
    //                 <span>{row.getValue("city")}</span>
    //             </div>
    //         )

    //     }
    // },
    {
        header: "Call Status",
        accessorKey: 'callStatus',
        enableSorting: true,
        cell: ({ row }) => {

            return (
                <div className="flex text-xs items-center">
                    <Badge
                        // variant={callStatus.toLowerCase() as any}
                        className="capitalize"
                    >
                        {row.getValue("callStatus")}
                    </Badge>
                </div>
            )
        },
    },
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


const EnquiryDetails = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const { onOpen } = useModal()
      return (
          <div className="flex items-center">
              <span
              className="text-blue-900 cursor-pointer hover:underline" 
              onClick={() => onOpen("enquiryDetails", { lead })}>{lead.id}</span>
          </div>
      )
  }