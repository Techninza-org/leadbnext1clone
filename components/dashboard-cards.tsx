'use client'
import { useManualQuery, useQuery } from 'graphql-hooks';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react'
import { rootMembersAtom, userAtom } from "@/lib/atom/userAtom";
import { AnalysisCard } from './analysis-card';
import { userQueries } from '@/lib/graphql/user/queries';

const DashboardCards = () => {
  const [userInfo] = useAtom(userAtom)
  const companyId = userInfo?.companyId

  const [rootMembersInfo] = useAtom(rootMembersAtom);

  const [getRootUsers, { data, loading, error }] = useManualQuery(userQueries.GET_COMPANIES);

  useEffect(() => {
    getRootUsers()
  }, [userInfo?.token, companyId])

  return (
    <div className="lg:grid grid-cols-3 gap-3">
      <AnalysisCard title='Total Companies' data={rootMembersInfo?.length || 0} />
    </div>
  )
}

export default DashboardCards