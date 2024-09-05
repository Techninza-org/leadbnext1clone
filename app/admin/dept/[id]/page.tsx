import React from 'react'
import CompanyDepartments from '@/components/User/Admin/company-departments';

const page = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    return (
        <CompanyDepartments id={String(id)} />
    )
}

export default page