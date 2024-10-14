import UpdateDepartmentFieldsModal from "@/components/dynamic/create-department-modal";

export default function FormPage({ params }: { params: { deptName: string, deptId: string, companyId: string } }) {
    return (<UpdateDepartmentFieldsModal deptName={params.deptName} deptId={params.deptId} />);
}
