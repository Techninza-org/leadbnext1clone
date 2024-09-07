'use client'
import { leadQueries } from '@/lib/graphql/lead/queries';
import { useQuery } from 'graphql-hooks';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react'
import { userAtom } from "@/lib/atom/userAtom";
import { AnalysisCard } from './analysis-card';
import { userQueries } from '@/lib/graphql/user/queries';

const RootManagerDashboardCards = () => {
    const [userInfo] = useAtom(userAtom)
    const companyId = userInfo?.companyId
    
    const { data, loading, error } = useQuery(leadQueries.GET_LEADS_BY_DATE_RANGE, {
        variables: {
            companyId: companyId,
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('en-GB'),
            endDate: new Date().toLocaleDateString('en-GB')
          }
    })
  return (
    <div className="lg:grid grid-cols-3 gap-3">
        <AnalysisCard title='Total Leads In Last 30 Days' data={data?.getLeadsByDateRange.numberOfLeads} />
        <AnalysisCard title='Total Payment Collected In Last 30 Days' data={data?.getLeadsByDateRange.totalPayCollectedCount} />
        <AnalysisCard title='Calls Made In Last 30 Days' data={data?.getLeadsByDateRange.callCount} />
    </div>
  )
}

export default RootManagerDashboardCards