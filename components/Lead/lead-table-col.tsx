import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadSchema } from "@/types/lead";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Switch } from "../ui/switch";
import { useMutation } from "graphql-hooks";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import HoverCardToolTip from "../hover-card-tooltip";
import { AssignedLeadTableRowActions } from "../User/Lead/assigned-lead-row-action";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/lib/atom/userAtom";

export const LeadColDefs: ColumnDef<z.infer<typeof leadSchema>>[] = [
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
                <ViewLeadInfo lead={row.original} />
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
        header: 'Address',
        accessorKey: 'address',
        cell: ({ row }) => {
            return (
                <HoverCardToolTip label="Address">
                    <span>{row.getValue("address")}</span>
                </HoverCardToolTip>
            )

        }
    },
    {
        header: 'City',
        accessorKey: 'city',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("city")}</span>
                </div>
            )
        }
    },
    {
        header: 'Assigned',
        accessorKey: '',
        cell: ({ row }) => {
            const rowData = row?.original;
            return (
                <AssigneeName lead={rowData} />
            );
        }
    },
];

const AssigneeName = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const userInfo = useAtomValue(userAtom)
    const assigneeName = lead?.LeadMember?.map((leadMember) => leadMember?.Member?.name).join(", ");
    return (
        <Button
            size={'sm'}
            variant={assigneeName ? "secondary" : "destructive"}
            className="text-xs p-2  capitalize"
        >
            {userInfo?.name !== assigneeName ? assigneeName : "Not Assigned"}
        </Button>
    )
}

export const ProspectColDefs: ColumnDef<z.infer<typeof leadSchema>>[] = [
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
                <ViewLeadInfo lead={row.original} />
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
        header: 'Address',
        accessorKey: 'address',
        cell: ({ row }) => {
            return (
                <HoverCardToolTip label="Address">
                    <span>{row.getValue("address")}</span>
                </HoverCardToolTip>
            )

        }
    },
    {
        header: 'City',
        accessorKey: 'city',
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span>{row.getValue("city")}</span>
                </div>
            )
        }
    },
    {
        header: 'Action',
        accessorKey: '',
        cell: ({ row }) => {
            const rowData = row?.original;
            const assigneeName = rowData?.LeadMember?.map((leadMember) => leadMember?.Member?.name).join(", ");
            const approved = rowData?.isLeadApproved

            return (
                <AssignedLeadTableRowActions lead={row.original} />
            );
        }
    },
];

const ViewLeadInfo = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const { onOpen } = useModal()

    return (
        <div className="flex items-center">
            <span
                className="text-blue-900 cursor-pointer hover:underline"
                onClick={() => onOpen("viewLeadInfo", { lead })}>{lead.name}</span>
        </div>
    )
}

export const LeadApprovedAction = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const { toast } = useToast()
    const [appvedLead, { loading, data, error }] = useMutation(leadMutation.APPROVED_LEAD_MUTATION)
    useEffect(() => {
        if (data?.appvedLead) {
            toast({
                title: "Transfer Successfully!"
            })
        }
        if (error) {
            toast({
                title: "Error",
                variant: "destructive"
            })

        }
    }, [data, error, toast])

    return (
        <Button
            className="bg-green-700"
            size={'sm'}
            onClick={async (value: any) => await appvedLead({
                variables: {
                    leadId: lead.id,
                    status: true
                }
            })}>
            Transfer
        </Button>
    )
}
