"use client";
import { useAtom, useAtomValue } from "jotai";

import { leads, prospects } from "@/lib/atom/leadAtom";

import { LeadColDefs, ProspectColDefs } from "./lead-table-col";
import { DataTableProspect } from "../ui/display-prospect-table";
import { Button } from "../ui/button";
import { Download, Plus, PlusCircle, Upload, UploadIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import ProspectsTable from "./custom-prospect-table";
import { useCompany } from "../providers/CompanyProvider";
import { useModal } from "@/hooks/use-modal-store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const ProspectTable = () => {
    const { onOpen } = useModal()
    const { optForms } = useCompany()
    const [selectedRows, setSelectedRows] = useState({})

    const prospectInfo = useAtomValue(prospects)

    const [searchTerm, setSearchTerm] = useState("")

    const filteredProspects = prospectInfo?.filter((prospect: any) =>
        Object.values(prospect).some((value: any) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const addProspectForm = optForms?.find((x: any) => x.name === "Prospect")

    const selectedLeads = Object.values(selectedRows) || []

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    <div>
                        Prospects
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <Button
                            onClick={() => onOpen("assignLead", { leads: selectedLeads })}
                            variant={'default'}
                            size={"sm"}
                            className="items-center gap-1"
                            disabled={!selectedLeads.length}
                        >
                            Assign Lead
                        </Button>
                        <div>
                            <label htmlFor="csv-upload">
                                <Button
                                    variant="default"
                                    color="primary"
                                    size={"sm"}
                                    className="items-center gap-1"
                                    onClick={() => onOpen("uploadPrspectModal", { fields: addProspectForm })}
                                >
                                    <UploadIcon size={15} /> <span>Upload Prospects</span>
                                </Button>
                            </label>
                        </div>
                        <Button
                            onClick={() => onOpen("addProspect", { fields: addProspectForm })}
                            variant={'default'}
                            size={"sm"}
                            className="items-center gap-1">
                            <PlusCircle size={15} /> <span>Add New Prospect</span>
                        </Button>
                    </div>

                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 my-2">
                    <Input
                        placeholder="Search prospects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <ProspectsTable data={filteredProspects} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
            </CardContent>
        </Card >
    )
}