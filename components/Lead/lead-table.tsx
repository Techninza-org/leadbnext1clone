"use client";
import { useState } from "react";
import { useAtom } from "jotai";

import { DataTable } from "@/components/ui/DataTable"
import { leads } from "@/lib/atom/leadAtom";

import { LeadColDefs } from "./lead-table-col";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const LeadTable = () => {
    const [leadInfo] = useAtom(leads)
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const groupedByFormName = leadInfo?.groupedLeads?.reduce((acc, current) => {
        if (!acc[current.formName]) {
            acc[current.formName] = [];
        }
        acc[current.formName].push(...current.feedback);
        return acc;
    }, {} as Record<string, { name: string; value: string }[]>);

    const data2Display = selectedRole && selectedRole !== 'all' ? groupedByFormName?.[selectedRole] : leadInfo;

    return (
        <>
            <div className="mb-6">
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
            </div>
            {/* @ts-ignore */}
            <DataTable columns={LeadColDefs} data={data2Display || []} />
        </>
    )
}