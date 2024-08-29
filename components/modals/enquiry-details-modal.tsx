"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area"
import { useModal } from "@/hooks/use-modal-store"
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { CalendarDaysIcon, ImageOffIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useQuery } from "graphql-hooks";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";


export const EnquiryDetailsModal = () => {

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead } = modalData;

    const isModalOpen = isOpen && type === "enquiryDetails";

    const FollowUpSchema = z.object({
        followUpDate: z.date().optional()
    })

    const form = useForm<z.infer<typeof FollowUpSchema>>({
        resolver: zodResolver(FollowUpSchema),
    });

    const onSubmit = async (values: z.infer<typeof FollowUpSchema>) => {
        const val = form.getValues();
        console.log(val, 'val');
        
        console.log(values, 'values');
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-md max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Enquiry Details
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-full w-full rounded-md border">
                    <div className="p-4">
                        {!!lead?.LeadFeedback && lead?.LeadFeedback?.map(({ feedback, member, imageUrls }) => (
                            <>
                                {member && <div className="flex justify-between pb-4 items-center">
                                    <div className="flex items-center">
                                        <span className="text-sm font-semibold">Submitted By:</span>
                                    </div>
                                    <span className="text-sm font-semibold capitalize">{member.name}
                                        <Badge className="ml-2" color={member.role.name === "MANAGER" ? "primary" : "secondary"}>
                                            {member.role.name}
                                        </Badge>
                                    </span>
                                </div>}

                                {
                                    feedback?.map((item) => {
                                        const isValidUrl = (url: string) => {
                                            const pattern = new RegExp('^(https?:\\/\\/)' + // protocol
                                                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
                                                'localhost|' + // localhost
                                                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                                                '(\\:\\d+)?' + // port
                                                '(\\/[-a-z\\d%_.~+\\s]*)*' + // path
                                                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                                                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                                            return !!pattern.test(url);
                                        };

                                        return (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-semibold">{item.name}</span>
                                                </div>
                                                {isValidUrl(item.value) ? (
                                                    <Link href={item.value} target="_blank" className="my-1">
                                                        <Image src={item.value} alt={item.name} height={250} width={250} className="rounded-sm h-24 w-24 object-cover" />
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm font-semibold capitalize">{item.value}</span>
                                                )}
                                            </div>
                                        );
                                    })
                                }

                                <div className="grid grid-cols-3 mt-3 justify-between gap-3 ">
                                    {
                                        imageUrls?.map((url, i) => (
                                            <Link
                                                key={i}
                                                target="_blank"
                                                href={url || "#"}

                                            >
                                                {url ? <Image
                                                    key={i}
                                                    src={url}
                                                    alt="Feedback Image"
                                                    loading="lazy"
                                                    height={100}
                                                    width={100}
                                                    className="rounded-md text-xs w-56 h-56 object-cover"
                                                /> :
                                                    <ImageOffIcon className="w-10 h-10" />
                                                }
                                            </Link>
                                        ))
                                    }
                                </div>
                                <Separator className="my-2" />
                                <p>Enquiry Id: {lead.id}</p>
                            </>
                        ))}
                    </div>
                    <div className="p-4 leading-10">
                        <h4 className="font-bold">ID: <span className="font-normal">{lead?.id}</span></h4>
                        <h4 className="font-bold">Customer Name: <span className="font-normal">{lead?.name}</span></h4>
                        <h4 className="font-bold">Customer Address: <span className="font-normal">{lead?.address}</span></h4>
                        {lead?.followUpDate && <h4 className="font-bold">Next Follow Up Date: <span className="font-normal">{String(lead?.followUpDate)}</span></h4>}
                        <div className="mt-4 w-1/3">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="followUpDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
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
                                <Button type="submit" className="mt-6 w-full">Submit</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}