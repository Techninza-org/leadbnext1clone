"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";
import { userAtom } from "@/lib/atom/userAtom";
import { RootTable } from "./root-table";
import { CompaniesListCol } from "./companies-list-col";
import { userQueries } from "@/lib/graphql/user/queries";

export const CompaniesListTable = () => {
    const [userInfo] = useAtom(userAtom);

    const { data, loading, error } = useQuery(userQueries.GET_COMPANIES, {
        variables: {
            role: "Root"
        }
    })   
    
    if (loading) return (
        <div>Loading...</div>
    )

    return (
        <RootTable columns={CompaniesListCol} data={data.getMembersByRole ?? []} />
    )
}