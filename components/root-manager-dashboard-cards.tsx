'use client'
import { AnalysisCard } from './analysis-card';
import { useCompany } from './providers/CompanyProvider';

const RootManagerDashboardCards = () => {
  const { leadRangeData } = useCompany()

  return (
    <div className="lg:grid grid-cols-3 gap-3">
      <AnalysisCard title='Total Leads In Last 30 Days' data={leadRangeData?.numberOfLeads} />
      <AnalysisCard title='Total Payment Collected In Last 30 Days' data={leadRangeData?.totalPayCollectedCount} />
      <AnalysisCard title='Calls Made In Last 30 Days' data={leadRangeData?.callCount} />
    </div>
  )
}

export default RootManagerDashboardCards