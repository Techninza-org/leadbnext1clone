"use client";
import { DataTable } from "@/components/ui/DataTable"

import { useQuery } from "graphql-hooks";
import { companyQueries } from "@/lib/graphql/company/queries";
// import { CustomerDefs } from "./customer-col";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { LOGIN_USER } from "@/lib/graphql/user/mutations";

export const renderContent = (content: string | string[]): JSX.Element => {
    const urlPattern = /^(https?:\/\/(?:localhost|\d{1,3}(?:\.\d{1,3}){3}|\w+)(?::\d+)?(?:\/[^\s]*)?)$/i;

    if (Array.isArray(content)) {
        return (
            <div className="flex gap-2">
                {content.map((url, index) => (
                    urlPattern.test(url) ? (
                        <img className="h-20 w-20 rounded-md" key={index} src={url} alt={`Content ${index + 1}`} width="100" />
                    ) : (
                        <span key={index}>{url}</span>
                    )
                ))}
            </div>
        );
    } else {
        return urlPattern.test(content) ? (
            <img src={content} alt="Content" width="100" />
        ) : (
            <>{content}</>
        );
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
    const xchangerListData = data?.paymentList?.data?.rows;

    const uniqueHeaders = new Set<string>();
    
    xchangerListData?.forEach((rowData: any) => {
        Object.keys(rowData).forEach((colName) => {
            if (colName !== "fieldType" && colName !== "name") {
                uniqueHeaders.add(colName);
            }
        });
    });

    const CustomerDefs = Array.from(uniqueHeaders).map((colName) => ({
        header: colName,
        accessorKey: colName,
        cell: ({ row }: { row: any }) => {
            const cellValue = row.original[colName];
            return <div className="capitalize">{renderContent(cellValue)}</div>;
        },
    }));
    
    return (
        <DataTable data={data?.paymentList?.data?.rows || []} columns={CustomerDefs as any || []} />
    )
}

