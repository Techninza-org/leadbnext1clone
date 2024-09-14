"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export const SettingsTable = () => {

    return (
        // <RootTable columns={SettingsCols} data={rootInfo ?? []} />
        <div className="rounded-md border mt-2">
            <Table className='text-sm'>
                <TableHeader>
                    <TableRow>
                        <TableHead>PLAN</TableHead>
                        <TableHead>PRICE</TableHead>
                        <TableHead>ALLOWED DEPTS</TableHead>
                    </TableRow>
                </TableHeader>
                {/* <TableBody>
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
                            </TableRow>
                        ))
                    }
                </TableBody> */}
            </Table>
        </div>
    )
}