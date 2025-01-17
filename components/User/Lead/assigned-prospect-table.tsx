"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";

import { userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";

import { AssignedProspectColDefs } from "./assigned-lead-table-col";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import { UserLeadTable } from "./user-lead-table";
import { useState } from "react";

export const AssignedProspectTable = () => {
    const [userInfo] = useAtom(userAtom);
    const [leadInfo, setAssigneLeads] = useState([])
    const { loading } = useQuery(leadQueries.GET_ASSIGNED_PROSPECT, {
        variables: { userId: userInfo?.id },
        skip: !userInfo?.id,
        onSuccess: ({ data }) => {
            setAssigneLeads(data.getAssignedProspect)
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

    return (
        <UserLeadTable columns={AssignedProspectColDefs} data={leadInfo || []} label="PROSPECT" />
    )
}