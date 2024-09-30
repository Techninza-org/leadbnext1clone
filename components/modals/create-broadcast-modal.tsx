'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useModal } from '@/hooks/use-modal-store';
import { BroadcastForm } from '../broadcast';

const CreateBroadcastModal = () => {
    const { isOpen, onClose, type, data: {broadcastForm} } = useModal();
    const isModalOpen = isOpen && type === "createBroadcast";
    const handleClose = () => {
        onClose();
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="text-black max-w-screen-sm">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold">
                        Broadcast
                    </DialogTitle>
                </DialogHeader>
                <BroadcastForm broadcastFormStructure={broadcastForm} />
            </DialogContent>
        </Dialog>

    )
}

export default CreateBroadcastModal