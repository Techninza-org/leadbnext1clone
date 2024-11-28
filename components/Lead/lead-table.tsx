"use client";
import { useAtom } from "jotai";
import { leads } from "@/lib/atom/leadAtom";
import { LeadColDefs } from "./lead-table-col";
import { DataTableLead } from "../ui/display-lead-table";

export const LeadTable = () => {
    const [leadInfo] = useAtom(leads)
    return (
        <>
            {/* @ts-ignore */}
            <DataTableLead columns={LeadColDefs} data={leadInfo || []} />
        </>
    )
}