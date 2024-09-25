"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createUpdateManagerSchema } from "@/types/auth"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQuery } from "graphql-hooks"
import { CREATE_OR_UPDATE_MANAGER, LOGIN_USER } from "@/lib/graphql/user/mutations"
import { userAtom } from "@/lib/atom/userAtom"
import { useAtomValue } from "jotai"
import { deptQueries } from "@/lib/graphql/dept/queries"
import { companyDeptSchema } from "@/types/company"
import { companyQueries } from "@/lib/graphql/company/queries"

export const CreateUpdateCompanyMenager = () => {

    const { toast } = useToast()
    const user = useAtomValue(userAtom)
    const [createOrUpdateManager, { loading, error, data }] = useMutation(CREATE_OR_UPDATE_MANAGER);

    const { loading: deptLoading, error: deptError, data: deptData } = useQuery(deptQueries.GET_COMPANY_DEPTS, {
        variables: { companyId: user?.companyId },
        skip: !user?.token || !user?.companyId,
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
        ],
    });

    const { loading: roleLoading, error: roleError, data: rolesData } = useQuery(companyQueries.GET_ALL_ROLES, {
        skip: !user?.companyId
    });

    const form = useForm<z.infer<typeof createUpdateManagerSchema>>({
        resolver: zodResolver(createUpdateManagerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            deptId: "",

        },
    })

    const onSubmit = async (data: z.infer<typeof createUpdateManagerSchema>) => {
        const { error, data: newResData } = await createOrUpdateManager({
            variables: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                memberType: data.type,
                password: `${data.name}@123`,
                roleId: data.roleId,
                deptId: data.deptId,
                companyId: user?.companyId
            }
        });

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
            title: "Manager Added Successfully!",
        })

        toast({
            variant: "default",
            title: "Note",
            description: `Password: ${data.name}@123 is set to default, please ask the user to change it`,
        })
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            placeholder="Name"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            placeholder="Email"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter Phone"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="deptId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            >
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                        >
                                            {
                                                deptData?.getCompanyDepts?.map((dept: z.infer<typeof companyDeptSchema>) => (
                                                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>

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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Member Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"

                                            >
                                                <SelectValue placeholder={"Select Member Type"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                        >
                                            <SelectItem value="DEPARTMENT">Department</SelectItem>
                                            <SelectItem value="COMPANY">Company</SelectItem>
                                            <SelectItem value="BOTH">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={rolesData?.getAllRoles?.find((role: any) => role.name === "Manager")?.id}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                disabled={true}
                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"

                                            >
                                                <SelectValue placeholder={rolesData?.getAllRoles?.find((role: any) => role.name === "Manager")?.name} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"

                                        >
                                            {
                                                rolesData?.getAllRoles?.find((role: any) => role.name === "Manager") && (
                                                    <SelectItem
                                                        key={rolesData.getAllRoles.find((role: any) => role.name === "Manager").id}
                                                        value={rolesData.getAllRoles.find((role: any) => role.name === "Manager").id}
                                                        className="capitalize">
                                                        {rolesData.getAllRoles.find((role: any) => role.name === "Manager").name}
                                                    </SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" className="mt-6">Register Member</Button>
            </form>
        </Form>
    )
}