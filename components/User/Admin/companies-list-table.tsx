"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";
import { rootMembersAtom, userAtom } from "@/lib/atom/userAtom";
import { RootTable } from "./root-table";
import { CompaniesListCol } from "./companies-list-col";
import { userQueries } from "@/lib/graphql/user/queries";

export const CompaniesListTable = () => {
    const [rootMembersInfo] = useAtom(rootMembersAtom);

    return (
        <RootTable columns={CompaniesListCol} data={rootMembersInfo ?? []} />
    )
}