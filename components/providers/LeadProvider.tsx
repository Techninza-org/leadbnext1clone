"use client"

import { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { APIError, useMutation, useQuery } from 'graphql-hooks';
import { useAtomValue, useSetAtom } from 'jotai';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';

import { leadSchema } from '@/types/lead';
import { leads, prospects } from '@/lib/atom/leadAtom';
import { leadQueries } from '@/lib/graphql/lead/queries';
import { userAtom } from '@/lib/atom/userAtom';
import { leadMutation } from '@/lib/graphql/lead/mutation';
import { LOGIN_USER } from '@/lib/graphql/user/mutations';

interface LeadProviderType {
    handleCreateLead: ({ lead, error }: { lead: z.infer<typeof leadSchema>, error?: APIError<object> | undefined }) => void;
    handleCreateBulkLead: ({ lead, error }: { lead: z.infer<typeof leadSchema>, error?: APIError<object> | undefined }) => void;
}

const LeadContext = createContext<LeadProviderType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: ReactNode }) => {
    const userInfo = useAtomValue(userAtom)
    const { toast } = useToast()
    const setLeads = useSetAtom(leads)
    const setProspect = useSetAtom(prospects)

    const { loading: leadsLoading } = useQuery(
        leadQueries.GET_COMPANY_LEADS,
        {
            variables: { companyId: userInfo?.companyId },
            skip: !userInfo,
            onSuccess: ({ data }) => {
                setLeads(data.getCompanyLeads.lead.filter((x: any) => x.isLeadApproved === true));
            },
            refetchAfterMutations: [
                {
                    mutation: LOGIN_USER,
                },
                {
                    mutation: leadMutation.LEAD_ASSIGN_TO,
                },
                {
                    mutation: leadMutation.CREATE_LEAD,
                },
                {
                    mutation: leadMutation.APPROVED_LEAD_MUTATION,
                },
            ],
        },
    );

    const { loading: prospectsLoading } = useQuery(
        leadQueries.GET_PROSPECT_LEADS,
        {
            onSuccess: ({ data }) => {
                setProspect(data.getCompanyProspects);
            },
            skip: !userInfo,
            refetchAfterMutations: [
                {
                    mutation: LOGIN_USER,
                },
                {
                    mutation: leadMutation.LEAD_ASSIGN_TO,
                },
                {
                    mutation: leadMutation.CREATE_LEAD,
                },
            ],
        },
    );

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

        toast({
            title: 'Success',
            description: 'Lead created successfully',
            variant: "default",
        })
    }
    const handleCreateBulkLead = async ({ lead, error }: { lead: any, error?: APIError<object> | undefined }) => {

        if (error) {
            const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ")
            toast({
                title: 'Error',
                description: message || "Something went wrong",
                variant: "destructive",
            })
            return;
        }

    }

    return (
        <LeadContext.Provider value={{ handleCreateLead, handleCreateBulkLead }}>
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