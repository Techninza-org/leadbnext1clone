'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModal } from '@/hooks/use-modal-store'
import { deptQueries } from '@/lib/graphql/dept/queries'
import { useQuery } from 'graphql-hooks'
import Link from 'next/link'
import React from 'react'

const CompanyDepartments = ({ id }: { id: string }) => {
  const [departments, setDepartments] = React.useState([])
  const { onOpen } = useModal()
  const { data, loading, error } = useQuery(deptQueries.GET_COMPANY_DEPTS, {
    variables: {
      companyId: id,
    },
    onSuccess: ({ data }) => {
      setDepartments(data?.getCompanyDepts[0]?.companyDeptForms)
    },
  })

  if (loading) return <div>Loading...</div>
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Departments</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-8'>
        {
          departments?.map((dept: any) => (
            <Card key={dept.id} onClick={() => onOpen("updateDepartmentFields", {deptName: dept.name, deptId: dept.id})}>
              <CardContent className='grid place-content-center p-6 hover:bg-slate-200 cursor-pointer hover:rounded-md'>
                <CardTitle>{dept.name}</CardTitle>
              </CardContent>
            </Card>
          ))
        }
      </CardContent>
    </Card>
  )
}

export default CompanyDepartments