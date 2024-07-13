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


export const ViewLeadInfoModal = () => {

    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead } = modalData;

    console.log(lead)

    const isModalOpen = isOpen && type === "viewLeadInfo";

    const handleClose = () => {
        onClose();
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-md max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Lead Details
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
                                    feedback?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold capitalize">{item.value}</span>
                                        </div>
                                    ))
                                }

                                <div className="grid grid-cols-3 mt-3 justify-between gap-3 ">
                                    {
                                        imageUrls?.map((url, i) => (
                                            <Link
                                                key={i}
                                                target="_blank"
                                                href={process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API ? `${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API}/assets${url}` : `http://localhost:8080${url}`}

                                            >
                                                <Image
                                                    key={i}
                                                    src={process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API ? `${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API}/assets${url}` : `http://localhost:8080${url}`}
                                                    alt="Feedback Image"
                                                    loading="lazy"
                                                    height={100}
                                                    width={100}
                                                    className="rounded-md text-xs w-56 h-56 object-cover"
                                                />
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