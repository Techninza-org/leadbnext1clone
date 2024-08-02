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

    const filteredLeads = selectedRole && selectedRole !== 'all'
        ? leadInfo?.filter(lead =>
            lead.LeadFeedback.some(feedback => feedback.member.role.name === selectedRole)
        )
        : leadInfo;

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
                            <SelectItem value="Telecaller">Telecaller</SelectItem>
                            <SelectItem value="Sales Person">Sales Person</SelectItem>
                            <SelectItem value="Exchange Manager">Exchange Manager</SelectItem>
                            <SelectItem value="Financer">Financer</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <DataTable columns={LeadColDefs} data={filteredLeads || []} />
        </>
    )
}