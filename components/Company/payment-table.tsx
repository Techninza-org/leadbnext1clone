"use client";
import { DataTable } from "@/components/ui/DataTable"

import { useQuery } from "graphql-hooks";
import { companyQueries } from "@/lib/graphql/company/queries";
// import { CustomerDefs } from "./customer-col";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { LOGIN_USER } from "@/lib/graphql/user/mutations";

export const renderContent = (text: string): JSX.Element => {
    const urlPattern = /^(https?:\/\/(?:localhost|\d{1,3}(?:\.\d{1,3}){3}|\w+)(?::\d+)?(?:\/[^\s]*)?)$/i;

    if (urlPattern.test(text)) {
        return <img src={text} alt="Content" width="100" />;
    } else {
        return <>{text}</>;
    }
};

export const PaymentTable = () => {

    const { data, loading, error } = useQuery(companyQueries.GET_PAYMENT_LIST, {
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
            {
                mutation: leadQueries.GET_COMPANY_LEADS
            }
        ]
    })

    const xchangerListData = data?.paymentList?.data?.rows


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
        <DataTable data={data?.paymentList?.data?.rows || []} columns={CustomerDefs as any || []} />
    )
}

