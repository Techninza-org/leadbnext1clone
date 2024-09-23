'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useModal } from '@/hooks/use-modal-store'
import { companyMutation } from '@/lib/graphql/company/mutation'
import { companyQueries } from '@/lib/graphql/company/queries'
import { deptQueries } from '@/lib/graphql/dept/queries'
import { userQueries } from '@/lib/graphql/user/queries'
import { useMutation, useQuery } from 'graphql-hooks'
import React, { useState } from 'react'

const CompanyDepartmentsRoot = ({ id }: { id: string }) => {
    const [departments, setDepartments] = React.useState([])
    const [deptId, setDeptId] = React.useState('')
    const [companySubscription, setCompanySubscription] = useState('')
    const [allowedDepartments, setAllowedDepartments] = useState([])
    const { onOpen } = useModal()
    const { toast } = useToast()
    const { data, loading, error } = useQuery(deptQueries.GET_COMPANY_DEPTS, {
        variables: {
            companyId: id,
        },
        onSuccess: ({ data }) => {
            setDeptId(data.getCompanyDepts[0].id)
            setDepartments(data?.getCompanyDepts[0]?.companyDeptForms)
        },
    })

    // const { data: plansData, loading: plansLoading } = useQuery(userQueries.GET_PLANS, {
    //   onSuccess: ({ data }) => {
    //     setPlans(data.getPlans)
    //   }
    // });

    const { data: activePlan, loading: subLoading } = useQuery(companyQueries.GET_COMPANY_SUBSCRIPTION, {
        variables: {
            companyId: id
        },
        onSuccess: ({ data }) => {
            console.log(data, 'data');

            if (data.getCompanySubscription.Subscriptions.length === 0) return;
            const subsLenght = data.getCompanySubscription.Subscriptions.length;
            setCompanySubscription(data.getCompanySubscription.Subscriptions[subsLenght - 1].planId)
            const allowedIds = data.getCompanySubscription.Subscriptions[subsLenght - 1].allowedDeptsIds
            console.log(allowedIds, 'allowedIds');
            
            setAllowedDepartments(departments.filter((dept: any) => allowedIds.includes(dept.id)));
        }
    });

    if (loading) return <div>Loading...</div>

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold">Departments</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-8'>
                {
                    departments?.map((dept: any) => (
                        <Card key={dept.id} onClick={() => onOpen("updateDepartmentFields", { deptName: dept.name, deptId: deptId, depId: id })}>
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

export default CompanyDepartmentsRoot