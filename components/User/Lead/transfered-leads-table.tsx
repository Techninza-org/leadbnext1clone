"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";

import { assignedLeadsAtom } from "@/lib/atom/leadAtom";
import { userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";

import { AssignedLeadColDefs } from "./assigned-lead-table-col";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import { UserLeadTable } from "./user-lead-table";

export const TransferedLeadsTable = () => {
    const [userInfo] = useAtom(userAtom);
    const [leadInfo, setAssigneLeads] = useAtom(assignedLeadsAtom)
    const { loading } = useQuery(leadQueries.GET_ASSIGNED_LEADS, { //////////have to change to call api for transfered leads
        variables: { userId: userInfo?.id },
        useCache: true,
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
            }
        ]
    });

    if (loading) return (
        <div>Loading...</div>
    )

    return (
        <UserLeadTable columns={AssignedLeadColDefs} data={leadInfo || []} />
    )
}