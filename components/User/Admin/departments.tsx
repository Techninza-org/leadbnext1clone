'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useModal } from '@/hooks/use-modal-store'
import { userAtom } from '@/lib/atom/userAtom'
import { companyMutation } from '@/lib/graphql/company/mutation'
import { companyQueries } from '@/lib/graphql/company/queries'
import { deptQueries } from '@/lib/graphql/dept/queries'
import { LOGIN_USER } from '@/lib/graphql/user/mutations'
import { userQueries } from '@/lib/graphql/user/queries'
import { useMutation, useQuery } from 'graphql-hooks'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'

const Departments = () => {
  const [departments, setDepartments] = React.useState([])
  const [deptId, setDeptId] = React.useState('')
  const user = useAtomValue(userAtom)
  const { onOpen } = useModal()
  const { toast } = useToast()
  const { data, loading, error } = useQuery(userQueries.GET_DEPT_FIELDS, {
    skip: !user?.token,
    refetchAfterMutations: [
        {
            mutation: LOGIN_USER
        },
    ],
    onSuccess: ({ data }) => {
        console.log(data, 'fields');
        
      setDepartments((data?.getDeptWFields[0]?.deptFields))
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
            <Card key={dept.id} onClick={() => onOpen("updateGlobalDepartmentFields", { deptName: dept.name, deptId: deptId})}>
              <CardContent className='grid place-content-center p-6 hover:bg-slate-200 cursor-pointer hover:rounded-md'>
                <CardTitle>{dept.name}</CardTitle>
              </CardContent>
            </Card>
          ))
        }
      </CardContent>
    </Card >
  )
}

export default Departments