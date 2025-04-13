import { DepartmentManagement } from "@/components/settings/department-management"

export default async function DepartmentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Department Management</h1>
      <DepartmentManagement />
    </div>
  )
}
