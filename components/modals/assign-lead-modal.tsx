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
import { userQueries } from "@/lib/graphql/user/queries"
import { useAtom, useAtomValue } from "jotai"
import { companyDeptMembersAtom, userAtom } from "@/lib/atom/userAtom"
import { createLeadSchema, leadAssignToSchema } from "@/types/lead"
import { Badge } from "../ui/badge"
import { leadMutation } from "@/lib/graphql/lead/mutation"

export const AssignLeadModal = () => {

    const userInfo = useAtomValue(userAtom)
    const [, setCompanyDeptMembers] = useAtom(companyDeptMembersAtom)

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { leads } = modalData;
    const leadIds = leads?.map((lead: z.infer<typeof createLeadSchema>) => lead?.id)

    const [leadAssignTo, { loading: assignLoading }] = useMutation(leadMutation.LEAD_ASSIGN_TO)

    const { loading, data } = useQuery(userQueries.GET_COMPANY_DEPT_MEMBERS, {
        skip: ((userInfo?.role.name.toLowerCase() !== "root") || (userInfo?.role.name.toLowerCase() !== "manager")) ? true : false,
        variables: {
            deptId: userInfo?.deptId,
            companyId: userInfo?.companyId,
        },
        refetchAfterMutations: leadAssignTo
    });


    setCompanyDeptMembers(data?.getCompanyDeptMembers)

    const isModalOpen = isOpen && type === "assignLead";

    const { toast } = useToast()

    const form = useForm<z.infer<typeof leadAssignToSchema>>({
        resolver: zodResolver(leadAssignToSchema),
        defaultValues: {
            userId: "",
            deptId: userInfo?.deptId,
            companyId: userInfo?.companyId,
            leadIds: leadIds || [],
        }
    })

    const isLoading = assignLoading || loading;

    const onSubmit = async (data: z.infer<typeof leadAssignToSchema>) => {

        const { data: assignResData, error } = await leadAssignTo({
            variables: {
                ...data,
                leadIds: leadIds
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
                        Assign Lead
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-48 w-full rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Selected Leads</h4>
                        {leads && leads.map((lead) => (
                            <>
                                <div key={lead.id} className="text-sm grid-cols-2 grid">
                                    <span>{lead.name}</span>
                                    <span>{lead.email}</span>
                                </div>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department Members</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 capitalize dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"

                                            >
                                                <SelectValue placeholder="Select Member" className="capitalize" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"

                                        >
                                            {
                                                data?.getCompanyDeptMembers?.map((member: z.infer<typeof createCompanyMemberSchema>) => (
                                                    <SelectItem
                                                        key={member?.id}
                                                        value={member?.id || ""}
                                                        className="capitalize"
                                                    >
                                                        {member?.name} <Badge variant={'secondary'}>{member.role?.name}</Badge>
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-6"
                            disabled={isLoading}
                        >Assign</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}