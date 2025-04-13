"use client";
import { useAtom } from "jotai";
import { useQuery, useMutation } from "graphql-hooks";

import { userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";

import { AssignedProspectColDefs } from "./assigned-lead-table-col";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import { UserLeadTable } from "./user-lead-table";
import { useState } from "react";
import { usePermission } from "@/components/providers/PermissionProvider";
import { PurposalBuilder } from "./purposal-builder";


export const AssignedProspectTable = () => {
    const [userInfo] = useAtom(userAtom);
    const [leadInfo, setAssigneLeads] = useState([])
    const { hasPermission } = usePermission()
    
    const { loading } = useQuery(leadQueries.GET_ASSIGNED_LEADS, {
        variables: { userId: userInfo?.id },
        skip: !userInfo?.id,
        onSuccess: ({ data }) => {
            setAssigneLeads(data.getAssignedLeads)
        },
        refetchAfterMutations: [
            {
                mutation: leadMutation.SUBMIT_LEAD
            },
            {
                mutation: leadMutation.SUBMIT_BID_MUTATION
            },
        ]
    });
    
   
    if (loading) return (
        <div>Loading...</div>
    )

    let updatedCols = [...AssignedProspectColDefs]

    if (hasPermission("Lead", "CRITICAL")) {
        updatedCols.push({
            id: "actions",
            cell: ({ row }) => (
                <PurposalBuilder row={row} />
            )
        })
        return (
            <UserLeadTable columns={updatedCols} data={leadInfo || []} label="LEAD" />
        )
    }

    return (
        <UserLeadTable columns={AssignedProspectColDefs} data={leadInfo || []} label="LEAD" />
    )
}