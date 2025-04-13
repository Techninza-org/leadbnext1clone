import { PermissionManagement } from "@/components/settings/permission-management"

export default async function PermissionsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Permission Management</h1>
      <PermissionManagement />
    </div>
  )
}
