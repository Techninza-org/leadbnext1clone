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
import { MANAGER, ROOT } from "@/lib/role-constant"
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/multiselect-input";


export const AssignLeadModal = () => {

    const userInfo = useAtomValue(userAtom)
    const [, setCompanyDeptMembers] = useAtom(companyDeptMembersAtom)

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { leads } = modalData;
    const leadIds = leads?.map((lead: z.infer<typeof createLeadSchema>) => lead?.id)

    const [leadAssignTo, { loading: assignLoading }] = useMutation(leadMutation.LEAD_ASSIGN_TO)

    const { loading, data: deptMembers } = useQuery(userQueries.GET_COMPANY_DEPT_MEMBERS, {
        skip: [ROOT, MANAGER].includes(userInfo?.role?.name || ""),
        variables: {
            deptId: userInfo?.deptId,
            companyId: userInfo?.companyId,
        },
        refetchAfterMutations: leadAssignTo,
        onSuccess: (data) => {
            setCompanyDeptMembers(deptMembers?.getCompanyDeptMembers)

        }
    });

    const isModalOpen = isOpen && type === "assignLead";

    const { toast } = useToast()

    const form = useForm<z.infer<typeof leadAssignToSchema>>({
        resolver: zodResolver(leadAssignToSchema),
        defaultValues: {
            userIds: [],
            leadIds: leadIds || [],
        }
    })

    const isLoading = assignLoading || loading;

    const onSubmit = async (data: z.infer<typeof leadAssignToSchema>) => {

        const isSomeTelecallerSalesPerson = deptMembers?.getCompanyDeptMembers?.filter((member: z.infer<typeof createCompanyMemberSchema>) => member?.role?.name.toLowerCase() === "telecaller" || member?.role?.name.toLowerCase().split(" ").join("") === "salesperson")

        const isExist = isSomeTelecallerSalesPerson.filter((member: z.infer<typeof createCompanyMemberSchema>) => data.userIds.includes(member?.id || ""))

        if (isExist.length > 1) {
            toast({
                title: 'Error',
                description: "Please select only one telecaller or salesperson to assign the lead.",
                variant: "destructive"
            })
            return;
        }

        const { data: assignResData, error } = await leadAssignTo({
            skip: isExist.length > 1,
            variables: {
                ...data,
                deptId: userInfo?.deptId,
                companyId: userInfo?.companyId,
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
            <DialogContent className="text-black max-w-screen-md min-h-[620px]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Assign Lead
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-60 w-full rounded-md border">
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
                            name="userIds"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Invite people</FormLabel>
                                    <MultiSelector
                                        onValuesChange={field.onChange}
                                        values={field.value}
                                    >
                                        <MultiSelectorTrigger>
                                            <MultiSelectorInput placeholder="Select members to assign" />
                                        </MultiSelectorTrigger>
                                        <MultiSelectorContent>
                                            <MultiSelectorList className="h-32 scrollbar-hide  overscroll-y-auto">
                                                {
                                                    deptMembers?.getCompanyDeptMembers?.map((member: z.infer<typeof createCompanyMemberSchema>) => (
                                                        <MultiSelectorItem
                                                            key={member?.id}
                                                            value={member?.id || ""}
                                                            className="capitalize"
                                                        >
                                                            <div>
                                                                {member?.name} <Badge variant={'secondary'}>{member.role?.name}</Badge>
                                                            </div>
                                                        </MultiSelectorItem>
                                                    ))}
                                            </MultiSelectorList>
                                        </MultiSelectorContent>
                                    </MultiSelector>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-10"
                            disabled={isLoading}
                        >Assign</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}