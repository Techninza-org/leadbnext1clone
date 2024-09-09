"use client";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";
import { rootMembersAtom, userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import { RootTable } from "./root-table";
import { CompaniesListCol } from "./companies-list-col";
import { SettingsCols } from "./settings-cols";
import { userQueries } from "@/lib/graphql/user/queries";

export const SettingsTable = () => {
    const [rootMembersInfo] = useAtom(rootMembersAtom);

    return (
        <RootTable columns={SettingsCols} data={rootMembersInfo ?? []} />
    )
}