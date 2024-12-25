import UpdateDepartmentFieldsModal from "@/components/dynamic/create-department-modal";

export default function FormPage({ params }: { params: { categoryName: string, deptName: string, deptId: string, companyId: string } }) {
    return (<UpdateDepartmentFieldsModal categoryName={params.categoryName} deptName={params.deptName} deptId={params.deptId} />);
}
