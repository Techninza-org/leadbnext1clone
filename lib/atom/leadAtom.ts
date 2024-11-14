import { z } from 'zod';
import { atom } from 'jotai';
import { companyLeadSchema, leadSchema } from '@/types/lead';

export const leads = atom<z.infer<typeof companyLeadSchema> | null>(null);
export const prospects = atom<z.infer<typeof companyLeadSchema> | null>(null);
export const assignedLeadsAtom = atom<z.infer<typeof leadSchema>[] | null>(null);