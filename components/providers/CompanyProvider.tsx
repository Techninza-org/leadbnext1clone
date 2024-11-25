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
import { leadQueries } from '@/lib/graphql/lead/queries';
import { companyQueries } from '@/lib/graphql/company/queries';
import { DeptMutation } from '@/lib/graphql/dept/mutation';

type CompanyContextType = {
    companyDeptMembers: z.infer<typeof createCompanyMemberSchema>[] | null;
    rootInfo: z.infer<typeof createCompanyMemberSchema>[] | null;
    members: any;
    companyDeptFields: any;
    leadRangeData: any;
    braodcasteForm: any;
    departments: any;
    optForms: any;
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
    const [leadRangeData, setLeadRangeData] = React.useState<any>([])
    const [departments, setDepartments] = useState([])
    const [optForms, setOptForms] = useState([])
    const [braodcasteForm, setBroadcastForm] = useState([])

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
        skip: !userInfo?.token,
        variables: { deptId: userInfo?.deptId },
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER,
            },
        ],
        onSuccess: ({ data }) => {
            if (data?.getCompanyDeptFields) setCompanyDeptFields(data?.getCompanyDeptFields)
        }
    });

    const { data: rootDate, loading, error } = useQuery(userQueries.GET_COMPANIES, {
        skip: !userInfo?.token,
        onSuccess: ({ data }) => {
            if (data?.getRootUsers) setRootInto(data.getRootUsers)
            if (data?.getRootUsers) setRootMembersAtom(data.getRootUsers)
        }
    });

    const { data: leadRange, loading: leadRangeLoader, error: leadRangeError, refetch } = useQuery(leadQueries.GET_LEADS_BY_DATE_RANGE, {
        variables: {
            companyId: userInfo?.companyId,
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('en-GB'),
            endDate: new Date().toLocaleDateString('en-GB')
        },
        skip: !userInfo?.token || !userInfo?.companyId,
        onSuccess: ({ data }) => {
            setLeadRangeData(data?.getLeadsByDateRange)
        },
    })

    const { } = useQuery(userQueries.GET_DEPT_FIELDS, {
        skip: !userInfo?.token,
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
        ],
        onSuccess: ({ data }) => {
            setDepartments((data?.getDeptWFields[0]?.deptFields))
        },
    })

    const { error: dpetError } = useQuery(userQueries.GET_DEPT_OPT_FIELDS, {
        skip: !userInfo?.token,
        variables: { deptId: userInfo?.deptId },
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
        ],
        onSuccess: ({ data }) => {
            setOptForms(data?.getCompanyDeptOptFields)
        },
    })

    const { } = useQuery(DeptMutation.GET_BROADCAST_FORM, {
        skip: !userInfo?.token,
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
        ],
        onSuccess: ({ data }) => {
            if (data?.broadcastForm) {
                setBroadcastForm(data?.broadcastForm)
            }
        },
    }
    )

    const { loading: addCardBtnLoading, data: broadcasteForm } = useQuery(companyQueries.GET_BROADCAST_FORM, {
        skip: !userInfo?.token,
        refetchAfterMutations: [
            {
                mutation: LOGIN_USER
            },
        ],
        onSuccess: ({ data }) => {
            if (data?.getBroadcastForm) {
                setBroadcastForm(data?.getBroadcastForm)
            }
        }
    });

    return (
        <CompanyContext.Provider value={{ braodcasteForm, departments, leadRangeData, companyDeptMembers, rootInfo, members, companyDeptFields, optForms }}>
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
