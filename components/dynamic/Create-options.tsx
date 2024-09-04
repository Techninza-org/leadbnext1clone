'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/use-modal-store';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const CreateOptions = () => {
    const { onOpen } = useModal();
    return (
        <div>
            <Link href="/admin/create/department">
            <Button
                variant={'default'}
                size={"sm"}
                className="items-center gap-1">
                <PlusCircle size={15} /> <span>New Department</span>
            </Button>
            </Link>
        </div>
    )
}

export default CreateOptions