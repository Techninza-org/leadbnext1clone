"use client";
import { useState } from "react";
import { useAtom } from "jotai";
import { useQuery } from "graphql-hooks";

import { DataTable } from "@/components/ui/DataTable"
import { leads } from "@/lib/atom/leadAtom";
import { userAtom } from "@/lib/atom/userAtom";
import { leadQueries } from "@/lib/graphql/lead/queries";

import { LeadColDefs } from "./lead-table-col";
import { leadMutation } from "@/lib/graphql/lead/mutation";

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
    const [userInfo] = useAtom(userAtom);
    const [leadInfo, setLeads] = useAtom(leads)
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const { loading } = useQuery(leadQueries.GET_COMPANY_LEADS, {
        variables: { companyId: userInfo?.companyId },
        useCache: true,
        onSuccess: ({ data }) => {
            setLeads(data.getCompanyLeads)
        },
        refetchAfterMutations: [
            {
                mutation: leadMutation.LEAD_ASSIGN_TO,
            },
            {
                mutation: leadMutation.CREATE_LEAD,
            }
        ]
    });

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
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Filter</SelectLabel>
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