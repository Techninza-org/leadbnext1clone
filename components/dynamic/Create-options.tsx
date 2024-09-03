'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/use-modal-store';
import { PlusCircle } from 'lucide-react';

const CreateOptions = () => {
    const { onOpen } = useModal();
    return (
        <div>
            <Button
                onClick={() => onOpen("createDepartment")}
                variant={'default'}
                size={"sm"}
                className="items-center gap-1">
                <PlusCircle size={15} /> <span>New Department</span>
            </Button>
        </div>
    )
}

export default CreateOptions