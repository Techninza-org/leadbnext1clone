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
import { useMutation, useQuery } from "graphql-hooks";
import { leadQueries } from "@/lib/graphql/lead/queries";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn, formatCurrencyForIndia, formatFormData } from "@/lib/utils";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { leadMutation } from "@/lib/graphql/lead/mutation";
import { useToast } from "../ui/use-toast";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "@/lib/atom/userAtom";
import { useCompany } from "../providers/CompanyProvider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import FollowUpForm from "../Lead/follow-up-form";
import FollowUpsData from "../Lead/follow-ups-data";


export const EnquiryDetailsModal = () => {
    const [selectedMember, setSelectedMember] = useState("");
    const [isFollowUpActive, setIsFollowUpActive] = useState(false);
    const user = useAtomValue(userAtom)
    const { isOpen, onClose, type, data: modalData } = useModal();

    const { lead } = modalData;
    const { companyDeptMembers } = useCompany()
    const [submitFeedback, { loading: feedBackLoading }] = useMutation(leadMutation.SUBMIT_LEAD);
    const [transferLead, { loading }] = useMutation(leadMutation.TRANSFER_LEAD);
    const { toast } = useToast();
    let members;

    const isModalOpen = isOpen && type === "enquiryDetails";

    const FollowUpSchema = z.object({
        followUpDate: z.date().optional()
    })

    const form = useForm<z.infer<typeof FollowUpSchema>>({
        resolver: zodResolver(FollowUpSchema),
    });


    const myrole = user?.role?.name;
    if (myrole === "Telecaller") {
        members = companyDeptMembers?.filter((member) => member.role?.name === "Sales Person" || member.role?.name === "Manager")
    } else if (myrole === "Manager") {
        members = companyDeptMembers?.filter((member) => member.role?.name !== "Manager")
    } else {
        members = companyDeptMembers?.filter((member) => member.role?.name === "Manager")
    }


    const onSubmit = async (values: z.infer<typeof FollowUpSchema>) => {

        const { data: resData, loading, error } = await submitFeedback({
            variables: {
                deptId: user?.deptId,
                leadId: lead?.id || "",
                nextFollowUpDate: values.followUpDate?.toLocaleDateString() || "",
                callStatus: lead?.callStatus,
                paymentStatus: lead?.paymentStatus,
                feedback: {
                    name: "Follow Up Date",
                    fieldType: "INPUT",
                    value: values.followUpDate?.toLocaleDateString() || "",
                },
                submitType: "updateLead",
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
            title: "Follow Up Date Submitted Successfully!",
        });
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    async function handleTransferLead() {

        const { data, error } = await transferLead({
            variables: {
                leadId: lead?.id,
                transferToId: selectedMember,
            }
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
            title: "Lead Transferred Successfully!",
        });
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-lg max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Enquiry Details
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-full w-full rounded-md border">
                    <div className="p-4 leading-10">
                        <div className=" grid grid-cols-2">
                            <h4 className="font-bold">ID: <span className="font-normal">{lead?.id}</span></h4>
                            <h4 className="font-bold">Customer Name: <span className="font-normal">{lead?.name}</span></h4>
                            <h4 className="font-bold">Customer Address: <span className="font-normal">{lead?.address}</span></h4>
                            {lead?.nextFollowUpDate && <h4 className="font-bold">Next Follow Up Date: <span className="font-normal">{String(lead?.nextFollowUpDate)}</span></h4>}
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="mt-4 w-1/2">
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
                            <div className=" w-1/2">
                                <h4 className="capitalize  font-bold text-zinc-500 dark:text-secondary/70">Transfer Lead</h4>
                                <Select onValueChange={(value) => setSelectedMember(value || "")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {members?.map((member) => (
                                                <SelectItem key={member.id} value={member.id || ''}>
                                                    {member.name} - {member.role?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button className="mt-6 w-full" onClick={handleTransferLead}>Transfer</Button>
                            </div>
                        </div>
                    </div>
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
                            </>
                        ))}
                        { lead?.bids && lead?.bids?.length > 0 &&
                            <ScrollArea className="h-44 w-full rounded-md border">
                                <div className="p-4">
                                    <h4 className="mb-4 text-sm font-medium leading-none">All Bids</h4>
                                    {!!lead?.bids && lead?.bids?.map((bid: any) => (
                                        <>
                                            <div key={bid?.id} className="text-sm grid-cols-2 grid">
                                                <span>{bid?.Member?.name || ""}</span>
                                                <span>{formatCurrencyForIndia(bid?.bidAmount || 0)}</span>
                                            </div>
                                            <Separator className="my-2" />
                                        </>
                                    ))}
                                </div>
                            </ScrollArea>
                        }
                        <div>
                            <FollowUpsData lead={lead} />
                            <div className="my-4 grid place-items-end grid-flow-col">
                                <Button
                                    size="sm"
                                    variant="default"
                                    disabled={isFollowUpActive}
                                    onClick={() => setIsFollowUpActive(!isFollowUpActive)}
                                >Add Follow Up</Button>
                            </div>
                            {isFollowUpActive && <FollowUpForm lead={lead} isFollowUpActive={isFollowUpActive} setIsFollowUpActive={setIsFollowUpActive} />}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}