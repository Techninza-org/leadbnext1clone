"use client";
import { useCompany } from "@/components/providers/CompanyProvider";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { userQueries } from "@/lib/graphql/user/queries";
import { useQuery } from "graphql-hooks";
import { useState } from "react";

interface Dept {
    id: string;
    name: string;
}

export const SettingsTable = () => {
    const { plans } = useSubscription()
    const {departments} = useCompany()

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
                <TableBody>
                    {
                        plans?.map((plan: any) => (
                            <TableRow
                                key={plan.id}
                            >
                                <TableCell>{plan.name}</TableCell>
                                <TableCell>{plan.price}</TableCell>
                                <TableCell>
                                    {plan.defaultAllowedDeptsIds.map((deptId: string) => {
                                        const dept = departments?.find((d: Dept) => d.id === deptId);
                                        //@ts-ignore
                                        return dept ? dept.name : 'Unknown Dept';
                                    }).join(', ')}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}