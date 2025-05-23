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
import { CheckIcon, Edit2Icon, ImageOffIcon, PencilIcon, UserPlus2Icon, X } from "lucide-react";
import { Button } from "../ui/button";
import FollowUpForm from "../Lead/follow-up-form";
import { Fragment, useEffect, useState } from "react";
import FollowUpsData from "../Lead/follow-ups-data";
import { formatCurrencyForIndia } from "@/lib/utils";
import { LeadApprovedAction } from "../Lead/lead-table-col";
import { Input } from "../ui/input";


export const ViewProspectInfoModal = () => {
    const [isFollowUpActive, setIsFollowUpActive] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { isOpen, onClose, type, data: modalData } = useModal();
    const { lead } = modalData;
    const [editingFeedback, setEditingFeedback] = useState<{ [key: string]: boolean }>({})
    const [feedbackValues, setFeedbackValues] = useState<{ [key: string]: string }>({})
    const [editingLead, setEditingLead] = useState<{ [key: string]: boolean }>({
        name: false,
        email: false,
        phone: false,
        address: false,
    })
    const [leadValues, setLeadValues] = useState<any>(lead)

    useEffect(() => {
        setLeadValues(lead)
    }, [lead])


    const isModalOpen = isOpen && lead && type === "viewProspectInfo";

    const handleClose = () => {
        onClose();
    }



    const toggleEdit = (feedbackId: string, value: string) => {
        setEditingFeedback(prev => ({ ...prev, [feedbackId]: !prev[feedbackId] }))
        setFeedbackValues(prev => ({ ...prev, [feedbackId]: value }))
    }

    const handleSave = (feedbackId: string) => {
        // Here you would typically make an API call to update the feedback
        setEditingFeedback(prev => ({ ...prev, [feedbackId]: false }))
    }

    const toggleLeadEdit = (field: any) => {
        setEditingLead(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleLeadSave = (field: any) => {
        // onLeadUpdate({ [field]: leadValues[field] })
        setEditingLead(prev => ({ ...prev, [field]: false }))
    }

    const isValidUrl = (url: string) => {
        const pattern = new RegExp('^(https?:\\/\\/)' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            'localhost|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?' +
            '(\\/[-a-z\\d%_.~+\\s]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i')
        return !!pattern.test(url)
    }

    const formatCurrencyForIndia = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount)
    }


    const renderEditableField = (field: any, label: string) => (
        <div className="flex justify-between pb-4 items-center">
            <span className="text-sm font-semibold">{label}:</span>
            {editingLead[field] ? (
                <div className="flex items-center">
                    <Input
                        value={leadValues[field] as string}
                        onChange={(e) => setLeadValues((prev: any) => ({ ...prev, [field]: e.target.value }))}
                        className="max-w-[200px] mr-2"
                    />
                    <Button size="icon" onClick={() => handleLeadSave(field)} aria-label={`Save ${label}`}>
                        <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => toggleLeadEdit(field)} aria-label={`Cancel editing ${label}`}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center">
                    <span className="text-sm font-semibold capitalize mr-2">{leadValues?.[field] as string}</span>
                    {isEditing && <Button size="icon" variant="ghost" onClick={() => toggleLeadEdit(field)} aria-label={`Edit ${label}`}>
                        <PencilIcon className="h-4 w-4" />
                    </Button>}
                </div>
            )}
        </div>
    )

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                setIsEditing(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-lg max-h-[80%]">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-2xl font-bold">
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge variant="outline" className="text-xs text-gray-600  font-medium">
                                    ID: {lead?.id}
                                </Badge>
                                <h2 className="pl-2">Lead Details</h2>
                            </div>
                            {/* <div className="flex items-center space-x-4">
                                {
                                    isEditing ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                            aria-label="Save changes (Alt + S)"
                                        >
                                            <Edit2Icon className="mr-2 h-4 w-4" />
                                            Save
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                            aria-label="Edit lead information (Alt + S)"
                                        >
                                            <Edit2Icon className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    )
                                }
                            </div> */}
                        </div>
                    </DialogTitle>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-sm font-medium">
                                {lead?.name}
                            </Badge>
                            {/* Add more badges for other important lead info */}
                        </div>
                        <div className="flex items-center space-x-4">
                            <LeadApprovedAction lead={lead as any} />
                        </div>
                    </div>
                </DialogHeader>
                <ScrollArea className="max-h-full w-full rounded-md border">
                    <div className="p-4">
                        {lead && (
                            <div>
                                {renderEditableField('name', 'Name')}
                                {renderEditableField('email', 'Email')}
                                {renderEditableField('phone', 'Phone')}
                            </div>
                        )}
                    
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
                            {isFollowUpActive && <FollowUpForm forLead={false} lead={lead} isFollowUpActive={isFollowUpActive} setIsFollowUpActive={setIsFollowUpActive} />}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog >
    )
}