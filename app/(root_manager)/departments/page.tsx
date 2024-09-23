'use client'
import CompanyDepartmentsRoot from '@/components/User/Admin/company-departments-root'
import { userAtom } from '@/lib/atom/userAtom'
import { useAtomValue } from 'jotai'
import React from 'react'

const page = () => {
    const user = useAtomValue(userAtom)
  return (
    <div>
        <CompanyDepartmentsRoot id={String(user?.companyId)} />
    </div>
  )
}

export default page