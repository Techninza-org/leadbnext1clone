"use client"

import { useEffect, useState } from "react";
import { CreateLeadModal } from "../modals/create-lead-modal";
import { AssignLeadModal } from "../modals/assign-lead-modal";
import { SubmitLeadModal } from "../modals/submit-lead-modal";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;


  return (
    <>
      <CreateLeadModal/>
      <AssignLeadModal/>
      <SubmitLeadModal/>

    </>
  );
};
