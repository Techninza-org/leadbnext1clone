'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModal } from '@/hooks/use-modal-store'
import { userAtom } from '@/lib/atom/userAtom'
import { deptQueries } from '@/lib/graphql/dept/queries'
import { LOGIN_USER } from '@/lib/graphql/user/mutations'
import { useQuery } from 'graphql-hooks'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react';

const CompanyDepartmentsRoot = () => {
  const [departments, setDepartments] = useState([]);
  const [deptId, setDeptId] = useState('');
  const { onOpen } = useModal();
  const userInfo = useAtomValue(userAtom);

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

  useEffect(()=>{
    if(data?.getCompanyDepts?.[0]?.companyDeptForms.length > 0){
      setDeptId(data.getCompanyDepts[0].id);
      setDepartments(data?.getCompanyDepts[0]?.companyDeptForms);
    }
  },[data])

  useEffect(() => {
    if (userInfo?.companyId || departments.length === 0) {
      refetch();    
    }
  }, [userInfo?.companyId]);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Departments</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-8">
        {departments?.map((dept: any) => (
          <Card key={dept.id} onClick={() => onOpen("updateDepartmentFields", { deptName: dept.name, deptId: deptId, depId: userInfo?.companyId })}>
            <CardContent className="grid place-content-center p-6 hover:bg-slate-200 cursor-pointer hover:rounded-md">
              <CardTitle>{dept.name}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompanyDepartmentsRoot;
