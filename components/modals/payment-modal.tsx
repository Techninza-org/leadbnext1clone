"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from '@/hooks/use-modal-store';
import { Tag } from 'lucide-react';

const schema = z.object({
    rechargeAmount: z.string().refine(
        v => {
            let n = Number(v);
            return !isNaN(n) && v?.length > 0 && n <= 10000;
        },
        { message: "Invalid amount or exceeds maximum recharge amount of 10000" }
    ),
    couponCode: z.string().optional()
});


export const PaymentModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "paymentGateway";

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            rechargeAmount: "500",
            couponCode: ""
        }
    });

    const handleSelect = (amount: string) => {
        form.setValue('rechargeAmount', amount);
    };

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {

            console.log(values);
            // form.reset();
            // router.refresh();
            onClose();
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
            <DialogContent className="bg-white dark:text-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Recharge You Wallet
                    </DialogTitle>
                    
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
};