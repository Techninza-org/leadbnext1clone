'use client'
import React from 'react'
import CompanyDepartmentsRoot from '@/components/User/Admin/company-departments-root'
import { userAtom } from '@/lib/atom/userAtom'
import { useAtomValue } from 'jotai'

const RootDepts = () => {
    // const user = useAtomValue(userAtom)
  return (
    <CompanyDepartmentsRoot />
  )
}

export default RootDepts