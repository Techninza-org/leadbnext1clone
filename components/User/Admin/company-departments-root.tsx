'use client'
import { useCompany } from '@/components/providers/CompanyProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModal } from '@/hooks/use-modal-store'
import { userAtom } from '@/lib/atom/userAtom'
import { deptQueries } from '@/lib/graphql/dept/queries'
import { LOGIN_USER } from '@/lib/graphql/user/mutations'
import { useQuery } from 'graphql-hooks'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useEffect, useState } from 'react';

const CompanyDepartmentsRoot = () => {
  const [deptId, setDeptId] = useState('');
  const { onOpen } = useModal();
  const userInfo = useAtomValue(userAtom);
  const { departments, braodcasteForm, optForms } = useCompany()

  const { data, loading, error, refetch } = useQuery(deptQueries.GET_COMPANY_DEPTS, {
    variables: {
      companyId: userInfo?.companyId,
    },
    skip: !userInfo?.token || !userInfo?.companyId,
    refetchAfterMutations: [
      {
        mutation: LOGIN_USER,
      },
    ],
  });

  useEffect(() => {
    if (data?.getCompanyDepts?.[0]?.companyForms?.length > 0) {
      setDeptId(data.getCompanyDepts[0].id);
    }
  }, [data])

  useEffect(() => {
    if (userInfo?.companyId || departments.length === 0) {
      refetch();
    }
  }, [userInfo?.companyId]);

  if (loading) return <div>Loading...</div>;

  const groupFormOnCategoryName = Object?.groupBy(
    data?.getCompanyDepts?.[0].companyForms ?? [],
    (form: any) => form?.category?.name || "Uncategorized"
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className='ml-auto '>
            <Button size={'sm'} onClick={() => onOpen('addDept')}>Add Department</Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-2'>
          {Object.entries(groupFormOnCategoryName).map(([categoryName, forms]) => (
            <Card key={categoryName}>
              <CardHeader>
                <CardTitle className="font-bold flex justify-between">
                  <div>{categoryName}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-8">
                {forms?.map((form) => (
                  <Link className='p-6 border rounded-md text-center shadow' href={`/departments/form/${categoryName}/${form.name}/${deptId}/${userInfo?.companyId}`} key={form.id}>
                    <CardTitle>{form.name}</CardTitle>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex justify-between font-bold">
            <div>Departments Forms (Auxiliary Forms)</div>
            <Button size={'sm'} onClick={()=>onOpen('addDept')}>Add Department</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-8">
          {data?.getCompanyDepts[0]?.companyForms?.map((dept: any) => (
            <Link className='p-6 border rounded-md text-center shadow' href={`/departments/form/${dept.name}/${deptId}/${userInfo?.companyId}`} key={dept.id}>
              <CardTitle>{dept.name}</CardTitle>
            </Link>
          ))}
        </CardContent>
      </Card> */}
      {/* <Card className='my-3'>
        <CardHeader>
          <CardTitle className="font-bold">Broadcast</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-8'>
          <Card onClick={() => onOpen("updateGlobalBroadcastForm", { dept: braodcasteForm })}>
            <CardContent className='grid place-content-center p-6 hover:bg-slate-200 cursor-pointer hover:rounded-md'>
              <CardTitle>{"Broadcast"}</CardTitle>
            </CardContent>
          </Card>
        </CardContent>
      </Card> */}

    </>
  );
};

export default CompanyDepartmentsRoot;
