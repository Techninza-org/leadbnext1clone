import AdminUpdateGlobalDepartmentFieldsModal from '@/components/admin/admin-update-global-department-modal';
import React from 'react'

const page = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    return (
        <AdminUpdateGlobalDepartmentFieldsModal deptName={id} />
    )
}

export default page