"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";

import { DataTable } from "@/components/ui/DataTable"
import { leads } from "@/lib/atom/leadAtom";
import { userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";

import { LeadColDefs } from "./lead-table-col";
import { leadMutation } from "@/lib/graphql/lead/mutation";

export const LeadTable = () => {
    const [userInfo] = useAtom(userAtom);
    const [leadInfo, setLeads] = useAtom(leads)
    const { loading } = useQuery(leadQueries.GET_COMPANY_LEADS, {
        variables: { companyId: userInfo?.companyId },
        useCache: true,
        onSuccess: ({ data }) => {
            setLeads(data.getCompanyLeads)
        },
        refetchAfterMutations: [
            {
                mutation: leadMutation.LEAD_ASSIGN_TO,
            }
        ]
    });

    return (
        <DataTable columns={LeadColDefs} data={leadInfo || []} />
    )
}