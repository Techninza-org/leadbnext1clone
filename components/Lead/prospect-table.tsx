"use client";
import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { DataTable } from "@/components/ui/DataTable"
import { leads, prospects } from "@/lib/atom/leadAtom";

import { LeadColDefs, ProspectColDefs } from "./lead-table-col";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button";
import { DataTableLead } from "../ui/display-lead-table";

export const ProspectTable = () => {
    const prospectInfo = useAtomValue(prospects)
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showUnassigned, setShowUnassigned] = useState<boolean>(false);

    // const groupedByFormName = leadInfo?.groupedLeads?.reduce((acc, current) => {
    //     if (!acc[current.formName]) {
    //         acc[current.formName] = [];
    //     }
    //     acc[current.formName].push(...current.feedback);
    //     return acc;
    // }, {} as Record<string, { name: string; value: string }[]>);


    // let data2Display = selectedRole && selectedRole !== 'all' ? groupedByFormName?.[selectedRole] : leadInfo;

    // if (showUnassigned) {
    //     //@ts-ignore
    //     data2Display = data2Display?.filter((lead: any) => (
    //         lead.isLeadApproved === false
    //     ))
    // }

    return (
        <>
            {/* <div className="mb-6">
                <Select onValueChange={(value) => setSelectedRole(value || null)}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All</SelectItem>
                            {
                                Object.keys(groupedByFormName || {}).map((formName) => (
                                    <SelectItem key={formName} value={formName}>
                                        {formName}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div> */}
            {/* <div className="flex float-end">
                <Button size={"sm"} className="items-center ml-2" onClick={() => setShowUnassigned((prev) => !prev)}>{showUnassigned ? 'Show All': 'Show Unassigned'}</Button>
            </div> */}
            {/* @ts-ignore */}
            <DataTableLead columns={ProspectColDefs} data={prospectInfo || []} />
        </>
    )
}