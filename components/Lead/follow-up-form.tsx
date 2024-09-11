'use client'
import React from 'react'
import { Card, CardContent } from '../ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '../ui/textarea';
import { useMutation } from 'graphql-hooks';
import { leadMutation } from '@/lib/graphql/lead/mutation';
import { useToast } from '../ui/use-toast';

const FollowUpSchema = z.object({
    nextFollowUpDate: z.date(),
    remarks: z.string().min(1, 'Remarks is required'),
    customerResponse: z.string().min(1, 'Customer Response is required'),
    rating: z.string().min(1, 'Rating is required'),
});

interface FollowUpFormProps {
    lead: any;
    isFollowUpActive: boolean;
    setIsFollowUpActive: React.Dispatch<React.SetStateAction<boolean>>;
  }

const FollowUpForm = ({ lead, isFollowUpActive, setIsFollowUpActive }: FollowUpFormProps) => {
    const [updateLeadFollowUpDate, { loading }] = useMutation(leadMutation.UPDATE_FOLLOWUP);
    const {toast} = useToast();
    
    const form = useForm<z.infer<typeof FollowUpSchema>>({
        resolver: zodResolver(FollowUpSchema),
        defaultValues: {
            nextFollowUpDate: new Date(),
            remarks: '',
            customerResponse: '',
            rating: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof FollowUpSchema>) => {
        try {
            const { data, error } = await updateLeadFollowUpDate({
                variables: {
                    leadId: lead?.id,
                    nextFollowUpDate: values.nextFollowUpDate?.toLocaleDateString() || "",
                    customerResponse: values.customerResponse,
                    rating: values.rating,
                    remark: values.remarks,
                },
            });
            
            if (error) {
                const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ");
                toast({
                    title: 'Error',
                    description: message || "Something went wrong",
                    variant: "destructive"
                });
                return;
            }
    
            toast({
                variant: "default",
                title: "FollowUp Added Successfully!",
            });
            
        } catch (error) {
            console.log(error);
        }
        setIsFollowUpActive(false);
    }

    const handleCancel = () => {
        form.reset();
        setIsFollowUpActive(false);
    }

    return (
        <Card>
            <CardContent className='my-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-3 gap-4'>
                            <FormField
                                control={form.control}
                                name="nextFollowUpDate"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel className="capitalize  font-bold text-zinc-500 dark:text-secondary/70">Select Follow Up Date</FormLabel>
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
                                                            <span>Pick Follow Up Date</span>
                                                        )}
                                                        <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value as any}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
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
                                name='customerResponse'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize font-bold text-zinc-500 dark:text-secondary/70">Customer Response</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="Select Response" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent
                                                className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            >
                                                <SelectItem value="Hot">Hot</SelectItem>
                                                <SelectItem value="Warm">Warm</SelectItem>
                                                <SelectItem value="Cold">Cold</SelectItem>

                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='rating'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize font-bold text-zinc-500 dark:text-secondary/70">Lead Rating</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                >
                                                    <SelectValue placeholder="Select Rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent
                                                className="bg-zinc-100 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                            >
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2">2</SelectItem>
                                                <SelectItem value="3">3</SelectItem>
                                                <SelectItem value="4">4</SelectItem>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="6">6</SelectItem>
                                                <SelectItem value="7">7</SelectItem>
                                                <SelectItem value="8">8</SelectItem>
                                                <SelectItem value="9">9</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mt-4'>
                            <FormField
                                control={form.control}
                                name="remarks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize font-bold text-zinc-500 dark:text-secondary/70">Remarks</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="bg-zinc-100/50 border-0 dark:bg-zinc-700 dark:text-white focus-visible:ring-slate-500 focus-visible:ring-1 text-black focus-visible:ring-offset-0"
                                                placeholder="Add Your Remarks"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid place-items-end justify-between grid-flow-col mt-2'>
                            <Button type="submit">Save</Button>
                            <Button type="button" variant={'destructive'} onClick={handleCancel}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default FollowUpForm