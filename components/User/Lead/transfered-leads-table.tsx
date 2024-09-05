"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";

import { assignedLeadsAtom } from "@/lib/atom/leadAtom";
import { userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";

import { AssignedLeadColDefs } from "./assigned-lead-table-col";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import { UserLeadTable } from "./user-lead-table";
import { TransferedLeadColDefs } from "./transfered-leads-table-cols";

export const TransferedLeadsTable = () => {
    const [userInfo] = useAtom(userAtom);
    
    const { data, loading} = useQuery(leadQueries.GET_TRANSFERED_LEADS, { 
        variables: { userId: userInfo?.id }
    });

    if (loading) return (
        <div>Loading...</div>
    )

    return (
        <UserLeadTable columns={TransferedLeadColDefs} data={data?.getTransferedLeads || []} />
    )
}