import { atom } from "jotai";

export type ModalType = "paymentGateway" | ""
export interface ModalData {
    customerId?: string;
    apiUrl?: string;
    query?: Record<string, any>;
}

export const modalTypeAtom = atom<ModalType | null>(null);
export const modalDataAtom = atom<ModalData>({});
export const modalIsOpenAtom = atom<boolean>(false);
