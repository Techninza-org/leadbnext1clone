import { createCompanyMemberSchema, loggedUserSchema } from '@/types/auth';
import { atom } from 'jotai';
import { z } from 'zod';


export const userAuthToken = atom<string | null>('');
export const userAtom = atom<z.infer<typeof loggedUserSchema> | null>(null);

export const companyDeptMembersAtom = atom<z.infer<typeof createCompanyMemberSchema>[]>([]);
export const rootMembersAtom = atom<z.infer<typeof createCompanyMemberSchema>[]>([]);
export const companyDeptFieldsAtom = atom<any[]>([]);