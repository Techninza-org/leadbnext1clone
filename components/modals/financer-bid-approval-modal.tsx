"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { useModal } from "@/hooks/use-modal-store"
import { useMutation } from "graphql-hooks"
import { leadMutation } from "@/lib/graphql/lead/mutation"


export const FinancerBidApprovalModal = () => {

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead } = modalData;

    const [UpdateLeadFinanceStatus, { loading }] = useMutation(leadMutation.UPDATE_LEAD_FINANCE_STATUS)

    const isModalOpen = isOpen && type === "finacerBidApproval";

    const { toast } = useToast()

    const onSubmit = async (status: boolean) => {

        const { error } = await UpdateLeadFinanceStatus({
            variables: {
                leadId: lead?.id,
                financeStatus: status
            }
        })

        if (error) {
            const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ")
            toast({
                title: 'Error',
                description: message || "Something went wrong",
                variant: "destructive"
            })
            return;
        }

        toast({
            variant: "default",
            title: "Lead Finance Status Updated!",
        })
        handleClose();
    }

    const handleClose = () => {
        onClose();
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-sm">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Assign Lead
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-60 w-full rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Selected Leads</h4>
                        {/* {leads && leads.map((lead) => (
                            <>
                                <div key={lead.id} className="text-sm grid-cols-2 grid">
                                    <span>{lead.name}</span>
                                    <span>{lead.email}</span>
                                </div>
                                <Separator className="my-2" />
                            </>
                        ))} */}
                    </div>
                </ScrollArea>
                <div className="flex justify-between">
                    <Button variant={'destructive'} disabled={loading} onClick={() => onSubmit(false)}>Reject</Button>
                    <Button disabled={loading} onClick={() => onSubmit(true)}>Approv</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}