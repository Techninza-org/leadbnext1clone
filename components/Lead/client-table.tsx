
"use client";
import { useAtom } from "jotai";

import { clients, leads } from "@/lib/atom/leadAtom";

import { useModal } from "@/hooks/use-modal-store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AdvancedDataTable from "../advance-data-table";
import { ClientColDefs, LeadColDefs } from "./lead-table-col";

export const ClientTable = () => {
    const { onOpen } = useModal()
    const [clientsInfo] = useAtom(clients)
    console.log(clientsInfo, "clientsInfo")
    const colsName = [
        'name',
        'email',
        'phone',
        'alternatePhone',
    ]
    // const addLeadForm = useCompany().optForms?.find((x: any) => x.name === "Lead")

    const MoreInfoLead = ({ selectedLeads }: { selectedLeads: any[] }) => {
        return (
            <div className="flex gap-2 ml-auto">
                
            </div>
        )
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    Clients
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AdvancedDataTable
                    leadProspectCols={ClientColDefs}
                    columnNames={colsName}
                    data={clientsInfo as any || []}
                    MoreInfo={MoreInfoLead}
                    
                />
            </CardContent>
        </Card >
    )
}