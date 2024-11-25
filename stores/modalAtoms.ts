import { z } from "zod";
import { atom } from "jotai";
import { createLeadSchema, leadSchema } from "@/types/lead";
import { CompanyDeptFieldSchema } from "@/types/company";

export type ModalType = "paymentGateway" | "addLead" | "assignLead" | "submitLead" | "bidForm" | "createBroadcast" | "finacerBidApproval" | 'viewLeadInfo' | "addMember" | "enquiryDetails" | "updateDepartmentFields" | "broadcastDetails" | "updateGlobalDepartmentFields" | "updateGlobalBroadcastForm"  | "uploadPrspectModal";
export interface ModalData {
    customerId?: string;

    lead?: z.infer<typeof leadSchema>,
    leads?: z.infer<typeof createLeadSchema>[],
    fields?: z.infer<typeof CompanyDeptFieldSchema>
    deptName?: string;
    deptId?: string;
    depId?: string;
    dept?: any;
    broadcastId?: string;
    broadcastForm?: any;

    apiUrl?: string;
    query?: Record<string, any>;
}

export const modalTypeAtom = atom<ModalType | null>(null);
export const modalDataAtom = atom<ModalData>({});
export const modalIsOpenAtom = atom<boolean>(false);
