"use client";
import { useState } from "react";
import { useAtomValue } from "jotai";

import { prospects } from "@/lib/atom/leadAtom";

import { LeadColDefs, ProspectColDefs } from "./lead-table-col";
import { DataTableProspect } from "../ui/display-prospect-table";

export const ProspectTable = () => {
    const prospectInfo = useAtomValue(prospects)

    return (
        <>
            {/* @ts-ignore */}
            <DataTableProspect columns={ProspectColDefs} data={prospectInfo || []} />
        </>
    )
}