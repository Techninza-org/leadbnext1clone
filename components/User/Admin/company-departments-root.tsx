'use client'
import { useCompany } from '@/components/providers/CompanyProvider'
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
  // const [departments, setDepartments] = useState([]);
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
    if (data?.getCompanyDepts?.[0]?.companyDeptForms.length > 0) {
      setDeptId(data.getCompanyDepts[0].id);
      // setDepartments(data?.getCompanyDepts[0]?.companyDeptForms);
    }
  }, [data])

  useEffect(() => {
    if (userInfo?.companyId || departments.length === 0) {
      refetch();
    }
  }, [userInfo?.companyId]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Departments Forms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-8">
          {departments?.map((dept: any) => (
            <Link className='p-6 border rounded-md text-center shadow'  href={`/departments/form/${dept.name}/${deptId}/${userInfo?.companyId}`} key={dept.id}>
              <CardTitle>{dept.name}</CardTitle>
            </Link>
          ))}
        </CardContent>
      </Card>
      <Card className='my-3'>
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
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Departments Operational Forms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-8">
          {optForms?.map((form: any) => (
            <Link className='p-6 border rounded-md text-center shadow' href={`/departments/optForms/${form.name}/${userInfo?.companyId}`}  key={form.id}>
              <CardTitle>{form.name}</CardTitle>
            </Link>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default CompanyDepartmentsRoot;
