"use client"

import { useEffect, useState } from "react";
import { CreateProspectModal } from "../modals/create-prospect-modal";
import { AssignLeadModal } from "../modals/assign-lead-modal";
import { SubmitLeadModal } from "../modals/submit-lead-modal";
import { BidFormModal } from "../modals/bid-form-modal";
import { FinancerBidApprovalModal } from "../modals/financer-bid-approval-modal";
import { ViewLeadInfoModal } from "../modals/view-lead-info-modal";
import { AssignMemberModal } from "../modals/assign-member-modal";
import { EnquiryDetailsModal } from "../modals/enquiry-details-modal";
import CreateBroadcastModal from "../modals/create-broadcast-modal";
import BroadcastDetailsModal from "../modals/broadcast-details-modal";
import UpdateGlobalDepartmentFieldsModal from "../dynamic/update-global-department-modal";
import UpdateGlobalBroadcastModal from "../dynamic/update-global-broadcast-modal";
import { UploadProspectModal } from "../modals/upload-prospect-modal";
import { UploadLeadModal } from "../modals/upload-lead-modal";
import { CreateLeadModal } from "../modals/create-lead-modal";
import { CreateDeptFormModal } from "../modals/create-dept-form-modal";
import { EditLeadFormValueModal } from "../modals/edit-lead-form-value-modal";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;


  return (
    <>
      <AssignMemberModal />
      <CreateLeadModal />
      <CreateDeptFormModal />
      <CreateProspectModal />
      <AssignLeadModal />
      <SubmitLeadModal />
      <BidFormModal />
      <FinancerBidApprovalModal />
      <ViewLeadInfoModal />
      <EnquiryDetailsModal />
      <CreateBroadcastModal />
      <BroadcastDetailsModal />
      <UpdateGlobalBroadcastModal />
      <UploadProspectModal />
      <UploadLeadModal />
      <EditLeadFormValueModal />
    </>
  );
};
