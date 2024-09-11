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

const FollowUpsData = ({ lead }: { lead: any }) => {
  const [followups, setFollowups] = React.useState([])
  const { data, loading, error } = useQuery(leadQueries.GET_FOLLOWUP, {
    variables: {
      leadId: lead?.id
    }
  })
  
  return (
    <div className="rounded-md border mt-2">
      <Table className='text-sm'>
        <TableHeader>
          <TableRow>
            <TableHead>WHEN CREATED</TableHead>
            <TableHead>ADDED BY</TableHead>
            <TableHead>NEXT FOLLOWUP</TableHead>
            <TableHead>CUSTOMER RESPONSE</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead>REMARKS</TableHead>
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