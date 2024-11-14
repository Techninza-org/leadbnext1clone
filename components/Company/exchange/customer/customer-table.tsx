"use client";
import { DataTable } from "@/components/ui/DataTable"

import { useQuery } from "graphql-hooks";
import { companyQueries } from "@/lib/graphql/company/queries";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { LOGIN_USER } from "@/lib/graphql/user/mutations";
import { renderContent } from "../../payment-table";

export const ExchangeCustomerTable = () => {

    const { data, loading, error } = useQuery(companyQueries.XCHANGE_CUSTOMER_LIST, {
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
            {
                mutation: leadQueries.GET_COMPANY_LEADS
            }
        ]
    })

    const xchangerListData = data?.xChangerCustomerList?.data?.rows

    const CustomerDefs = xchangerListData?.map((rowData: any) => {
        const columns = Object.keys(rowData)
            .filter((key) => key !== "fieldType" && key !== "name")
            .map((colName) => ({
                header: colName,
                accessorKey: colName,
                cell: ({ row }: { row: any }) => {
                    const cellValue = row.original[colName];
                        return <div className="capitalize">{renderContent(cellValue)}</div>;
                },
            }));
    
        return columns;
    }).flat(); 

    return (
        <DataTable data={data?.xChangerCustomerList?.data?.rows || []} columns={CustomerDefs as any || []} />
    )
}