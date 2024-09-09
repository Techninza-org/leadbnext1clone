"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";
import { rootMembersAtom, userAtom } from "@/lib/atom/userAtom";
import { RootTable } from "./root-table";
import { CompaniesListCol } from "./companies-list-col";
import { userQueries } from "@/lib/graphql/user/queries";
import { useCompany } from "@/components/providers/CompanyProvider";

export const CompaniesListTable = () => {
    // const [rootMembersInfo] = useAtom(rootMembersAtom);
    const { rootInfo } = useCompany()

    return (
        <RootTable columns={CompaniesListCol} data={rootInfo ?? []} />
    )
}