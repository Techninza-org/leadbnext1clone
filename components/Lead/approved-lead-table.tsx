"use client";
import { Key, useState } from "react";
import { useAtom } from "jotai";

import { leads } from "@/lib/atom/leadAtom";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ApprovedDataTable } from "./approved-data-table";
import { AssignedLeadColDefs } from "./apptoved-table-col";
import { useCompany } from "../providers/CompanyProvider";

export const ApprovedLeadTable = () => {
    const [leadInfo] = useAtom(leads)
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedForm, setSelectedForm] = useState<string | null>(null);
    const { companyDeptFields: deptFields } = useCompany();

    const groupedByFormName = leadInfo?.groupedLeads?.reduce((acc, current) => {
        if (!acc[current.formName]) {
            acc[current.formName] = [];
        }
        acc[current.formName].push(...current.feedback);
        return acc;
    }, {} as Record<string, { name: string; value: string }[]>);

    const data2Display = selectedRole && selectedRole !== 'all' ? groupedByFormName?.[selectedRole] : leadInfo;
    //@ts-ignore
    let filteredLeads = data2Display?.filter((lead: any) => (
        lead.isLeadApproved === true
    ))

    if (filteredLeads) {
        if (selectedForm && selectedForm == 'Payment') {
            //@ts-ignore
            filteredLeads = filteredLeads?.filter((lead: any) => (
                lead.paymentStatus === "PAID"
            ))
        } else if (selectedForm && selectedForm == 'Exchange') {
            //@ts-ignore
            filteredLeads = filteredLeads?.filter((lead: any) => (
                lead.bids.length > 0
            ))
        } else if (selectedForm && selectedForm == 'Document') {
            const documents = deptFields?.filter((doc: any) => doc.name === 'Document');
            const fields = documents[0]?.subDeptFields || [];
            //@ts-ignore
            filteredLeads = filteredLeads?.filter((lead: any) => {
                const feedback = lead.LeadFeedback[0]?.feedback || [];

                return feedback.some((fb: any) => {
                    return fields.some((field: any) => field.name === fb.name);
                });
            });
        } else if (selectedForm && selectedForm == 'Reporting') {
            const documents = deptFields?.filter((doc: any) => doc.name === 'Reporting');
            const fields = documents[0]?.subDeptFields || [];
            //@ts-ignore
            filteredLeads = filteredLeads?.filter((lead: any) => {
                const feedback = lead.LeadFeedback[0]?.feedback || [];

                return feedback.some((fb: any) => {
                    return fields.some((field: any) => field.name === fb.name);
                });
            });
        } else if (selectedForm && selectedForm == 'Customer Feedback') {
            //@ts-ignore
            filteredLeads = filteredLeads?.filter((lead: any) => {
                const feedback = lead.LeadFeedback[0]?.feedback || [];

                return feedback.some((fb: any) => {
                    return fb.name === 'Customer Feedback'
                });
            });
        }

        return (
            <>
                <div className="mb-6 flex gap-6">
                    {/* <Select onValueChange={(value) => setSelectedRole(value || null)}>
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
                </Select> */}
                    <Select onValueChange={(value) => setSelectedForm(value || null)}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                {
                                    deptFields?.map((dept: { id: Key | null | undefined; name: string }) => (
                                        <SelectItem key={dept.id} value={dept.name}>
                                            {dept.name}
                                        </SelectItem>
                                    ))
                                }
                                <SelectItem value="Customer Feedback">Feedback</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* @ts-ignore */}
                <ApprovedDataTable columns={AssignedLeadColDefs} data={filteredLeads || []} />
            </>
        )
    }
}