"use client"

import { useEffect, useState } from "react";
import { PaymentModal } from "../modals/payment-modal";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;


  return (
    <>
      <PaymentModal />

    </>
  );
};
