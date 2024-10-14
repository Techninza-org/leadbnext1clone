import React from 'react'
import UpdateGlobalDepartmentFieldsModal from '@/components/dynamic/update-global-department-modal';

const page = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    return (
        <UpdateGlobalDepartmentFieldsModal deptName={id}  />
    )
}

export default page