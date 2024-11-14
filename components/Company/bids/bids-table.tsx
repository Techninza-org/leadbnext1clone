"use client";
import { DataTable } from "@/components/ui/DataTable"

import { useQuery } from "graphql-hooks";
import { companyQueries } from "@/lib/graphql/company/queries";
import { BidsColDefs } from "./bids-col";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { LOGIN_USER } from "@/lib/graphql/user/mutations";
import { FollowUpBidDataTable } from "@/components/ui/followupBIdDataTable";

export const BidsTable = () => {

    const { data, loading, error } = useQuery(companyQueries.GET_COMPANY_XCHANGER_BIDS_QUERY,{
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
        <Card>
            <CardHeader>
                <CardTitle className="font-bold">Bids</CardTitle>
            </CardHeader>
            <CardContent>
                <FollowUpBidDataTable data={data?.getCompanyXchangerBids || []} columns={BidsColDefs} />
            </CardContent>
        </Card>
    )
}