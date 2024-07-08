"use client"

import { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { APIError, useQuery } from 'graphql-hooks';
import { useSetAtom } from 'jotai';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';

import { leadSchema } from '@/types/lead';
import { leads } from '@/lib/atom/leadAtom';

interface LeadProviderType {
    handleCreateLead: ({ lead, error }: { lead: z.infer<typeof leadSchema>, error?: APIError<object> | undefined }) => void;
}

const LeadContext = createContext<LeadProviderType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast()
    const setLeads = useSetAtom(leads)

    const handleCreateLead = async ({ lead, error }: { lead: z.infer<typeof leadSchema>, error?: APIError<object> | undefined }) => {

        if (error) {
            const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ")
            toast({
                title: 'Error',
                description: message || "Something went wrong",
                variant: "destructive",
            })
            return;
        }

        // setLeads((prev) => {
        //     if (!prev) return [lead]
        //     return [...prev, lead]
        // })

        setLeads([lead])

        toast({
            title: 'Success',
            description: 'Lead created successfully',
            variant: "default",
        })
    }

    return (
        <LeadContext.Provider value={{ handleCreateLead }}>
            {children}
        </LeadContext.Provider>
    );
};

export const useLead = (): LeadProviderType => {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};