import UpdateDepartmentOptFieldsModal from "@/components/dynamic/create-department-opt-modal";

export default function FormPage({ params }: { params: { optFormName: string, companyId: string } }) {
    return (<UpdateDepartmentOptFieldsModal deptName={params.optFormName} companyId={params.companyId} />);
}
