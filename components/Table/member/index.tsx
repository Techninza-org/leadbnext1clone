"use client"
import { MemberDataTable } from "./member-table"
import { MemberColDefs } from "./member-table-col"
import { useCompany } from "@/components/providers/CompanyProvider"

export const MemberTable = () => {

    const { companyDeptMembers } = useCompany()

    return (
        <MemberDataTable data={companyDeptMembers || []} columns={MemberColDefs} />
    )
}