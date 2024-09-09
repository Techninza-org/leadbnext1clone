"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'graphql-hooks';
import { userAtom } from '@/lib/atom/userAtom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useModal } from '@/hooks/use-modal-store';
import { createLeadSchema } from '@/types/lead';
import { leadMutation } from '@/lib/graphql/lead/mutation';

import { useLead } from '@/components/providers/LeadProvider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useEffect } from 'react';
import { deptQueries } from '@/lib/graphql/dept/queries';

export const CreateLeadModal = () => {
    const { handleCreateLead } = useLead()
    const [userInfo] = useAtom(userAtom)
    const { isOpen, onClose, type } = useModal();
    const [createLead, { loading }] = useMutation(leadMutation.CREATE_LEAD);

    const user = useAtomValue(userAtom)

    const { loading: deptLoading, error: deptError, data: deptData } = useQuery(deptQueries.GET_COMPANY_DEPTS, {
        variables: { companyId: user?.companyId },
    });

    const isModalOpen = isOpen && type === "addLead";

    const form = useForm<z.infer<typeof createLeadSchema>>({
        resolver: zodResolver(createLeadSchema),
    });

    const isLoading = form.formState.isSubmitting || loading;

    const onSubmit = async (values: z.infer<typeof createLeadSchema>) => {
        try {
            const { data, error } = await createLead({
                variables: {
                    companyId: userInfo?.companyId || "",
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    alternatePhone: values.alternatePhone,
                    address: values.address,
                    city: values.city,
                    state: values.state,
                    zip: values.zip,
                    vehicleDate: format(values.vehicleDate, 'dd-MM-yyyy'),
                    vehicleName: values.vehicleName,
                    vehicleModel: values.vehicleModel,
                    department: values.department
                }
            });
            

            handleCreateLead({ lead: data?.createLead, error });

            if (!error) {
                handleClose();
            }
        } catch (error) {
            console.log(error);
        }
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
                        Create Lead
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="name"
                                                disabled={isLoading}
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
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="email"
                                                disabled={isLoading}
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
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="phone"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="alternatePhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">alternate Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 border-0 placeholder:capitalize  dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="Alternate Phone"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">address</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="address"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">city</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="city"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">zip</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="zip"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">state</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="state"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">vehicle Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="vehicle Name"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicleModel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">vehicle Model</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="vehicle Model"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="vehicleDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">Issue Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-zinc-100 placeholder:capitalize  border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="Issue Date"
                                                disabled={isLoading}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                        control={form.control}
                                        name="vehicleDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="capitalize text-xs font-bold text-zinc-500 dark:text-secondary/70">Issue Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value as any}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                            control={form.control}
                            name="department"
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
                                                deptData?.getCompanyDepts?.map((role: any) => (
                                                    <SelectItem key={role.id} value={role.name} className="capitalize">{role.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>
                        <Button type="submit" className="mt-6 w-full">Create</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
};