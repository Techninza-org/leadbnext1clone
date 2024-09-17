"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useManualQuery, useMutation, useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { useAtom, useAtomValue } from 'jotai';
import { companyDeptFieldsAtom, companyDeptMembersAtom, rootMembersAtom, userAtom } from "@/lib/atom/userAtom";
import { z } from 'zod';
import { createCompanyMemberSchema } from '@/types/auth';
import { leadMutation } from '@/lib/graphql/lead/mutation';
import { LOGIN_USER, UPDATE_USER_COMPANY } from '@/lib/graphql/user/mutations';
import { deptQueries } from '@/lib/graphql/dept/queries';

type CompanyContextType = {
    companyDeptMembers: z.infer<typeof createCompanyMemberSchema>[] | null;
    rootInfo: z.infer<typeof createCompanyMemberSchema>[] | null;
    members: any;
    companyDeptFields: any;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
    const userInfo = useAtomValue(userAtom)

    const [leadAssignTo, { loading: assignLoading }] = useMutation(leadMutation.LEAD_ASSIGN_TO)
    const [companyDeptMembers, setCompanyDeptMembers] = useAtom(companyDeptMembersAtom);
    const [companyDeptFields, setCompanyDeptFields] = useAtom(companyDeptFieldsAtom);
    const [rootMembersInfo, setRootMembersAtom] = useAtom(rootMembersAtom)
    const [rootInfo, setRootInto] = useState<z.infer<typeof createCompanyMemberSchema>[] | null>(null)
    const [members, setMembers] = useState<any>([])


    const { skip, variables } = {
        skip: ['ROOT', 'MANAGER'].includes(userInfo?.role?.name || ""),
        variables: {
            deptId: userInfo?.deptId,
            companyId: userInfo?.companyId,
        },
    };

    const { data: memberData } = useQuery(userQueries.GET_MEMBERS, {
        skip: !userInfo?.token,
        variables: {
            role: "Sales Person"
        },
        refetchAfterMutations: LOGIN_USER,
        onSuccess: ({ data }) => {
            setMembers(data)
        }
    })

    const { data, error: queryError, loading: queryLoading } = useQuery(userQueries.GET_COMPANY_DEPT_MEMBERS, {
        skip,
        variables,
        refetchAfterMutations: [leadAssignTo, UPDATE_USER_COMPANY],
        onSuccess: ({ data }) => {
            if (data?.getCompanyDeptMembers) setCompanyDeptMembers(data.getCompanyDeptMembers)
        }
    });

    const { data: deptFields, loading: deptFieldsLoading, error: deptFieldsError } = useQuery(deptQueries.GET_COMPANY_DEPT_FIELDS, {
        variables: { deptId: userInfo?.deptId },
        onSuccess: () => {
            if (deptFields?.getCompanyDeptFields) setCompanyDeptFields(deptFields.getCompanyDeptFields)
        }
    });

    const { data: rootDate, loading, error } = useQuery(userQueries.GET_COMPANIES, {
        skip: !userInfo?.token,
        onSuccess: ({ data }) => {
            if (data?.getRootUsers) setRootInto(data.getRootUsers)
            if (data?.getRootUsers) setRootMembersAtom(data.getRootUsers)
        }
    })

    return (
        <CompanyContext.Provider value={{ companyDeptMembers, rootInfo, members, companyDeptFields }}>
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
