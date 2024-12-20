import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from 'graphql-hooks'
import { leadQueries } from '@/lib/graphql/lead/queries'
import HoverCardToolTip from '../hover-card-tooltip'
import { format } from 'date-fns'
import { useCompany } from '../providers/CompanyProvider'

const FollowUpsData = ({ lead }: { lead: any }) => {
  const [followups, setFollowups] = React.useState([])
  const { data, loading, error } = useQuery(leadQueries.GET_FOLLOWUP, {
    variables: {
      leadId: lead?.id
    }
  })

  const { optForms } = useCompany()
  const fields = optForms.find((x: any) => x.name === "Enquiry")

  return (
    <div className="rounded-md border mt-2">
      <Table className='text-sm'>
        <TableHeader>
          <TableRow className='uppercase'>
            <TableHead>WHEN CREATED</TableHead>
            <TableHead>ADDED BY</TableHead>
            {fields?.subDeptFields?.map((x: any) => (
              <TableHead key={x.name}>{x.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data?.getFollowUpByLeadId?.map((row: any) => (
              <TableRow
                key={row.id}
              >
                <TableCell>{row.createdAt}</TableCell>
                <TableCell>{row.followUpBy.name}</TableCell>
                <TableCell>{row.nextFollowUpDate}</TableCell>
                <TableCell>{row.customerResponse}</TableCell>
                <TableCell>{row.rating}</TableCell>
                <TableCell>
                  <HoverCardToolTip label="Remark">
                    <span>{row.remark}</span>
                  </HoverCardToolTip>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default FollowUpsData