import { z } from "zod";
import { atom } from "jotai";
import { createLeadSchema, leadSchema } from "@/types/lead";
import { CompanyDeptFieldSchema } from "@/types/company";

export type ModalType = "paymentGateway" | "addLead" | "assignLead" | "submitLead" | "bidForm" | "createBroadcast" | "finacerBidApproval" | 'viewLeadInfo' | "addMember" | "enquiryDetailsLead" | "enquiryDetailsProspect" | "updateDepartmentFields" | "broadcastDetails" | "updateGlobalDepartmentFields" | "updateGlobalBroadcastForm"  | "uploadPrspectModal" | "addProspect" | "uploadLeadModal" | "addDept" | 'editLeadFormValue' | "viewProspectInfo" | "assignForm";
export interface ModalData {
    customerId?: string;

    lead?: z.infer<typeof leadSchema>,
    leads?: z.infer<typeof createLeadSchema>[],
    fields?: any
    deptName?: string;
    deptId?: string;
    depId?: string;
    dept?: any;
    broadcastId?: string;
    broadcastForm?: any;

    apiUrl?: string;
    query?: string;
}

export const modalTypeAtom = atom<ModalType | null>(null);
export const modalDataAtom = atom<ModalData>({});
export const modalIsOpenAtom = atom<boolean>(false);
