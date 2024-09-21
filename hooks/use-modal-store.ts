'use client'
import { useAtom } from 'jotai';
import { modalTypeAtom, modalDataAtom, modalIsOpenAtom } from '@/stores/modalAtoms';
import { ModalType, ModalData } from '@/stores/modalAtoms';

export const useModal = () => {
  const [type, setType] = useAtom(modalTypeAtom);
  const [data, setData] = useAtom(modalDataAtom);
  const [isOpen, setIsOpen] = useAtom(modalIsOpenAtom);

  const onOpen = (type: ModalType, data: ModalData = {}) => {
    setType(type);
    setData(data);
    setIsOpen(true);
  };

  const onClose = () => {
    setType(null);
    setData({});
    setIsOpen(false);
  };

  return { type, data, isOpen, onOpen, onClose };
};