"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { useAtom, useAtomValue } from 'jotai';
import { companyDeptMembersAtom, rootMembersAtom, userAtom } from "@/lib/atom/userAtom";
import { z } from 'zod';
import { createCompanyMemberSchema } from '@/types/auth';
import { leadMutation } from '@/lib/graphql/lead/mutation';

type CompanyContextType = {
    companyDeptMembers: z.infer<typeof createCompanyMemberSchema>[] | null;
    rootMembersInfo: z.infer<typeof createCompanyMemberSchema>[] | null;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
    const userInfo = useAtomValue(userAtom)

    const [leadAssignTo, { loading: assignLoading }] = useMutation(leadMutation.LEAD_ASSIGN_TO)
    const [companyDeptMembers, setCompanyDeptMembers] = useAtom(companyDeptMembersAtom);
    const [rootMembersInfo, setRootMembersAtom] = useAtom(rootMembersAtom)

    const { skip, variables } = {
        skip: ['ROOT', 'MANAGER'].includes(userInfo?.role?.name || ""),
        variables: {
            deptId: userInfo?.deptId,
            companyId: userInfo?.companyId,
        },
    };

    const { data, error: queryError, loading: queryLoading } = useQuery(userQueries.GET_COMPANY_DEPT_MEMBERS, {
        skip,
        variables,
        refetchAfterMutations: leadAssignTo,
        onSuccess: ({ data }) => {
            if (data?.getCompanyDeptMembers) setCompanyDeptMembers(data.getCompanyDeptMembers)
        }
    });

    const { data: rootDate, loading, error } = useQuery(userQueries.GET_COMPANIES, {
        onSuccess: ({ data }) => {
            if (data?.getRootUsers) setRootMembersAtom(data.getRootUsers)
        }
    })


    return (
        <CompanyContext.Provider value={{ companyDeptMembers, rootMembersInfo }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
