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
import { ImageOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import FollowUpForm from "../Lead/follow-up-form";
import { useState } from "react";
import FollowUpsData from "../Lead/follow-ups-data";


export const ViewLeadInfoModal = () => {
    const [isFollowUpActive, setIsFollowUpActive] = useState(false);

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead } = modalData;


    const isModalOpen = isOpen && type === "viewLeadInfo";

    const handleClose = () => {
        onClose();
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-md max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Prospect Details
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-full w-full rounded-md border">
                    <div className="p-4">
                        {
                            lead && (
                                <div>
                                    <div className="flex justify-between pb-4 items-center">
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold">Name:</span>
                                        </div>
                                        <span className="text-sm font-semibold capitalize">{lead.name}</span>
                                    </div>
                                    <div className="flex justify-between pb-4 items-center">
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold">Email:</span>
                                        </div>
                                        <span className="text-sm font-semibold capitalize">{lead.email}</span>
                                    </div>
                                    <div className="flex justify-between pb-4 items-center">
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold">Phone:</span>
                                        </div>
                                        <span className="text-sm font-semibold capitalize">{lead.phone}</span>
                                    </div>
                                    <div className="flex justify-between pb-4 items-center">
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold mr-10">Address:</span>
                                        </div>
                                        <span className="text-sm font-semibold capitalize">{lead.address} {lead.city}</span>
                                    </div>
                                    <Separator className="my-2" />
                                </div>
                            )
                        }
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
                            </>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}