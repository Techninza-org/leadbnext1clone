import { z } from 'zod';
import { atom } from 'jotai';
import { leadSchema } from '@/types/lead';

export const leads = atom<z.infer<typeof leadSchema>[] | null>(null);
export const assignedLeadsAtom = atom<z.infer<typeof leadSchema>[] | null>(null);