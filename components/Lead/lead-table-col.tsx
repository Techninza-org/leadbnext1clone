import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { leadSchema } from "@/types/lead";
import { Button } from "../ui/button";
import ActionTooltip from "../action-tooltip";
import { MANAGER } from "@/lib/role-constant";
import { useModal } from "@/hooks/use-modal-store";
import { Switch } from "../ui/switch";
import { useMutation } from "graphql-hooks";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import HoverCardToolTip from "../hover-card-tooltip";

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
            const assigneeName = rowData?.LeadMember?.map((leadMember) => leadMember?.Member?.name).join(", ");
            const approved = rowData?.isLeadApproved
            // const notAssigned = assigneeName === 'rounak' ? true : false
            // const isAssigned = [MANAGER, "company"].includes(assigneeName?.toLowerCase());

            return (
                // <ActionTooltip label={assigneeName === 'rounak' ? 'Awaited' : assigneeName} align="center" side="top" key={"assignedMembers"}>
                <Button
                    size={'sm'}
                    variant={approved ? "secondary" : "destructive"}
                    className="text-xs p-2  capitalize"
                >
                    {approved ? assigneeName : "Not Assigned"}
                </Button>
                // </ActionTooltip>
                // <span>{assigneeName}</span>
            );
        }
    },
    {
        header: 'Department',
        cell: ({ row }) => {
            const dept = row.original?.department
            return (
                <span>{dept}</span>
            );
        }
    },
    {
        header: 'Converted To Lead',
        accessorKey: '',
        cell: ({ row }) => {
            const rowData = row?.original;

            return (
                <LeadApprovedAction lead={rowData} />
            );
        }
    }
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

const LeadApprovedAction = ({ lead }: { lead: z.infer<typeof leadSchema> }) => {
    const [appvedLead, { loading }] = useMutation(leadMutation.APPROVED_LEAD_MUTATION)

    return (
        <Switch id="isLeadApproved" checked={lead.isLeadApproved} onCheckedChange={async (value: any) => await appvedLead({
            variables: {
                leadId: lead.id,
                status: value
            }
        })} />
    )
}
