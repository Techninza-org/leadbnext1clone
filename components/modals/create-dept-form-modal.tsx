"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { useToast } from "@/components/ui/use-toast"
import { useModal } from "@/hooks/use-modal-store"
import { useAtomValue } from "jotai"
import { userAtom } from "@/lib/atom/userAtom"
import { Input } from "../ui/input"
import { DeptMutation } from "@/lib/graphql/dept/mutation"
import { useMutation, useQuery } from "graphql-hooks"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { deptQueries } from "@/lib/graphql/dept/queries"
import { LOGIN_USER } from "@/lib/graphql/user/mutations"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"

const creatDeptFormSchema = z.object({
    formName: z.string(),
    deptId: z.string(),
    isDependentOn: z.boolean(),
    dependentFormName: z.string().optional(),
});


export const CreateDeptFormModal = () => {

    const userInfo = useAtomValue(userAtom)

    const { isOpen, onClose, type, data: modalData } = useModal();

    const [CreateNUpdateCompanyDeptForm, { loading: assignLoading }] = useMutation(DeptMutation.UPDATE_DEPT)

    const { loading: deptLoading, error: deptError, data: deptData } = useQuery(deptQueries.GET_COMPANY_DEPTS, {
        variables: { companyId: userInfo?.companyId },
        skip: !userInfo?.token || !userInfo?.companyId,
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
        ],
    });

    const isModalOpen = isOpen && type === "addDept";

    const { toast } = useToast()

    const form = useForm<z.infer<typeof creatDeptFormSchema>>({
        resolver: zodResolver(creatDeptFormSchema),
        defaultValues: {
            deptId: "",
            formName: "",
            isDependentOn: false,
            dependentFormName: ""
        }
    })

    const formDeptId = form.watch("deptId")

    const selectedDept = (deptData?.getCompanyDepts.find((x: any) => x.id == formDeptId))

    const onSubmit = async (data: z.infer<typeof creatDeptFormSchema>) => {


        const { data: formRes, error } = await CreateNUpdateCompanyDeptForm({
            variables: {
                input: {
                    deptName: selectedDept.name,
                    companyDeptId: data.deptId,
                    name: data.formName,
                    order: 7,
                    subDeptFields: []
                }
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

    console.log(deptData?.getCompanyDepts, "deptData?.getCompanyDepts")

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-md">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Department
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="deptId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">Department</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            >
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"

                                        >
                                            {
                                                deptData?.getCompanyDepts?.map((dept: any) => (
                                                    <SelectItem key={dept.id} value={dept.id} className="capitalize">{dept.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="formName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">Form Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the form name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="isDependentOn"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 capitalize text-xs font-bold text-zinc-500 mt-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Dependent On
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {form.watch("isDependentOn") && <FormField
                            control={form.control}
                            name="dependentFormName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">Dependent Form</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            >
                                                <SelectValue placeholder="Select Dependent" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                        >
                                            {
                                                selectedDept?.companyDeptForms?.map((dept: any) => (
                                                    <SelectItem key={dept.id} value={dept.id} className="capitalize">{dept.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

                        <Button type="submit" className="mt-6">Submit</Button>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}