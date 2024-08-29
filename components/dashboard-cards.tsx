'use client'
import { leadQueries } from '@/lib/graphql/lead/queries';
import { useQuery } from 'graphql-hooks';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react'
import { userAtom } from "@/lib/atom/userAtom";
import { AnalysisCard } from './analysis-card';

const DashboardCards = () => {
    const [userInfo] = useAtom(userAtom)
    const companyId = userInfo?.companyId
    
    const { data, loading, error } = useQuery(leadQueries.GET_LEADS_BY_DATE_RANGE, {
        variables: {
            companyId: companyId,
            startDate: "05/08/2024",
            endDate: "25/08/2024"
          }
    })
  return (
    <div className="lg:grid grid-cols-3 gap-3">
        <AnalysisCard title='Calls Made In Last Month' data={data?.getLeadsByDateRange.callCount} />
        <AnalysisCard title='Total Payment Collected' data={data?.getLeadsByDateRange.totalPayCollectedCount} />
        <AnalysisCard title='Calls Made In Last Month' data={data?.getLeadsByDateRange.callCount} />
    </div>
  )
}

export default DashboardCards