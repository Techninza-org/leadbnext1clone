import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const FollowUpsData = ({ lead }: { lead: any }) => {
    return (
        <div className="rounded-md border mt-2">
            <Table className='text-xs'>
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
                    {/* {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )} */}
                </TableBody>
            </Table>
        </div>
    )
}

export default FollowUpsData