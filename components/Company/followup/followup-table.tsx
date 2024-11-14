"use client";
import { DataTable } from "@/components/ui/DataTable"

import { useQuery } from "graphql-hooks";
import { companyQueries } from "@/lib/graphql/company/queries";
import { BidsColDefs } from "./followup-col";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { LOGIN_USER } from "@/lib/graphql/user/mutations";
import { FollowUpBidDataTable } from "@/components/ui/followupBIdDataTable";

export const FollowupTable = () => {

    const { data, loading, error } = useQuery(companyQueries.GET_FOLLOWUP, {
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
            {
                mutation: leadQueries.GET_COMPANY_LEADS
            }
        ]
    })

    return (
        <FollowUpBidDataTable data={data?.getFollowUps || []} columns={BidsColDefs} />
    )
}