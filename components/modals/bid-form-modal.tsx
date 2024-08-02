"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCompanyMemberSchema } from "@/types/auth"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { useToast } from "@/components/ui/use-toast"
import { useModal } from "@/hooks/use-modal-store"
import { useMutation, useQuery } from "graphql-hooks"
import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atom/userAtom"
import { leadBidSchema, leadBidsSchema } from "@/types/lead"
import { Badge } from "../ui/badge"
import { leadMutation } from "@/lib/graphql/lead/mutation"
import { leadQueries } from "@/lib/graphql/lead/queries"
import { Input } from "../ui/input"
import { formatCurrencyForIndia } from "@/lib/utils"

export const BidFormModal = () => {

    const userInfo = useAtomValue(userAtom)

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead } = modalData;

    const isModalOpen = isOpen && type === "bidForm";

    const { data, loading, error } = useQuery(leadQueries.GET_LEAD_BIDS_QUERY, {
        skip: !lead?.id,
        variables: {
            leadId: lead?.id
        }
    })


    const [submitBid, { loading: submitLoading, error: submitError }] = useMutation(leadMutation.SUBMIT_BID_MUTATION);


    const { toast } = useToast()

    const form = useForm<z.infer<typeof leadBidSchema>>({
        resolver: zodResolver(leadBidSchema),
        defaultValues: {
            bidAmount: "",
            description: "",
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (data: z.infer<typeof leadBidSchema>) => {

        const { error } = await submitBid({
            variables: {
                ...data,
                leadId: lead?.id,
                memberId: userInfo?.id,
                deptId: userInfo?.deptId,
                companyId: userInfo?.companyId,
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
            title: "Member Added Successfully!",
        })
        handleClose();
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-sm">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Lead Bid
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-48 w-full rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">All Bids</h4>
                        {!!data?.getLeadBids ? data?.getLeadBids.map((bid: z.infer<typeof leadBidsSchema>) => (
                            <>
                                <div key={bid?.id} className="text-sm grid-cols-2 grid">
                                    <span>{bid?.Member?.name}</span>
                                    <span>{formatCurrencyForIndia(bid?.bidAmount || 0)}</span>
                                </div>
                                <Separator className="my-2" />
                            </>
                        )): <p className="text-gray-600 col-span-2 text-center">No Bids, Till Now!</p>}
                    </div>
                </ScrollArea>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="bidAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bid Amount</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="Bid Amount"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>

                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="Description"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>

                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-6"
                            disabled={isLoading}
                        >Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}