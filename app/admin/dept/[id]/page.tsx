'use client'
import React from 'react'
import { useParams } from 'next/navigation';
import CompanyDepartments from '@/components/User/Admin/company-departments';

const page = () => {
    const params = useParams();
    const {id} = params;
    
    return (
        <div>
            <CompanyDepartments id={String(id)} />
        </div>
    )
}

export default page