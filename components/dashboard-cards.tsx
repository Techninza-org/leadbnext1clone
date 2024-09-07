'use client'
import { leadQueries } from '@/lib/graphql/lead/queries';
import { useQuery } from 'graphql-hooks';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react'
import { userAtom } from "@/lib/atom/userAtom";
import { AnalysisCard } from './analysis-card';
import { userQueries } from '@/lib/graphql/user/queries';

const DashboardCards = () => {
    const [userInfo] = useAtom(userAtom)
    const companyId = userInfo?.companyId
    
    const { data, loading, error } = useQuery(userQueries.GET_COMPANIES, {
      variables: {
          role: "Root"
      }
  }) 

  return (
    <div className="lg:grid grid-cols-3 gap-3">
        <AnalysisCard title='Total Companies' data={data?.getMembersByRole.length} />
    </div>
  )
}

export default DashboardCards