import { RoleManagement } from "@/components/settings/role-management"

export default async function RolesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Role Management</h1>
      <RoleManagement />
    </div>
  )
}
