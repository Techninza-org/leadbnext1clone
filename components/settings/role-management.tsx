'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useManualQuery, useMutation } from 'graphql-hooks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useCompany } from '../providers/CompanyProvider'
import { usePermission } from '../providers/PermissionProvider'
import { roleQueries } from '@/lib/graphql/role/queries'
import { companyQueries } from '@/lib/graphql/company/queries'


const CREATE_COMPANY_ROLE = roleQueries.CREATE_COMPANY_ROLE

const UPDATE_ROLE = `
  mutation UpdateRole($id: String!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
      description
      companyDeptForm
      updatedAt
    }
  }
`

const DELETE_ROLE = `
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id) {
      id
      name
    }
  }
`

interface Role {
  id: string
  name: string
  description?: string
  companyDeptForm: string[]
  createdAt: string
  updatedAt: string
}

export function RoleManagement() {
  // State
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    description: ''
  })
  
  const router = useRouter()
  const { companyMemberRoles } = useCompany()
  const { hasPermission } = usePermission()
  
  // GraphQL queries
  const [getRoles] = useManualQuery(companyQueries.GET_ALL_ROLES, {
    onSuccess: ({ data }) => {
      if (data?.getAllRoles) {
        setRoles(data.getAllRoles)
      }
      setLoading(false)
    }
  })
  
  const [createRole, { loading: createLoading }] = useMutation(CREATE_COMPANY_ROLE, {
    onSuccess: ({ data }) => {
      if (data?.createCompanyRole) {
        // Refresh roles after creation
        fetchRoles()
        toast.success('Role created successfully')
        resetForm()
        setIsCreateDialogOpen(false)
      }
    }
  })
  
  const [updateRole, { loading: updateLoading }] = useMutation(UPDATE_ROLE, {
    onSuccess: ({ data }) => {
      if (data?.updateRole) {
        setRoles(roles.map(role => 
          role.id === data.updateRole.id ? data.updateRole : role
        ))
        toast.success('Role updated successfully')
        resetForm()
        setIsEditDialogOpen(false)
        setSelectedRole(null)
      }
    }
  })
  
  const [deleteRole, { loading: deleteLoading }] = useMutation(DELETE_ROLE, {
    onSuccess: ({ data }) => {
      if (data?.deleteRole) {
        setRoles(roles.filter(role => role.id !== data.deleteRole.id))
        toast.success('Role deleted successfully')
      }
    }
  })
  
  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles()
  }, [])
  
  // Use company member roles if available
  useEffect(() => {
    if (companyMemberRoles && companyMemberRoles.length > 0) {
      setRoles(companyMemberRoles)
      setLoading(false)
    }
  }, [companyMemberRoles])
  
  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true)
    await getRoles()
  }
  
  // Reset form state
  const resetForm = () => {
    setFormState({
      name: '',
      description: ''
    })
  }
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }
  
  // Handle create role
  const handleCreateRole = async () => {
    if (!formState.name) {
      toast.error('Role name is required')
      return
    }
    
    await createRole({
      variables: {
        roleName: formState.name
      }
    })
  }
  
  // Handle edit role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setFormState({
      name: role.name,
      description: role.description || ''
    })
    setIsEditDialogOpen(true)
  }
  
  // Handle update role
  const handleUpdateRole = async () => {
    if (!selectedRole || !formState.name) {
      toast.error('Role name is required')
      return
    }
    
    await updateRole({
      variables: {
        id: selectedRole.id,
        input: {
          name: formState.name,
          description: formState.description,
          companyDeptForm: selectedRole.companyDeptForm
        }
      }
    })
  }
  
  // Handle delete role
  const handleDeleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      await deleteRole({
        variables: { id }
      })
    }
  }
  
  // Handle remove form from role
  const handleRemoveForm = async (roleId: string, formName: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return
    
    const updatedForms = role.companyDeptForm.filter(f => f !== formName)
    
    await updateRole({
      variables: {
        id: roleId,
        input: {
          name: role.name,
          description: role.description,
          companyDeptForm: updatedForms
        }
      }
    })
    
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Roles</h2>
        {/* {hasPermission('Role', 'CREATE') && ( */}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Role
          </Button>
        {/* )} */}
      </div>
      
      {loading ? (
        <div className="text-center py-4">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="text-center py-4">No roles found.</div>
      ) : (
        <div className="space-y-4">
          {roles.map(role => (
            <Card key={role.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div>
                    <span>{role.name}</span>
                    {role.description && (
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {hasPermission('Role', 'UPDATE') && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {hasPermission('Role', 'DELETE') && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              {/* <CardContent>
                <h3 className="text-sm font-medium mb-2">Assigned Forms:</h3>
                <div className="flex flex-wrap gap-2">
                  {role?.companyDeptForm?.length > 0 ? (
                    role.companyDeptForm.map((form: any) => (
                      <Badge key={form} variant="secondary" className="flex items-center">
                        {typeof form === 'string' ? form : form.name}
                        {hasPermission('Role', 'UPDATE') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => handleRemoveForm(role.id, form)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No forms assigned</span>
                  )}
                </div>
              </CardContent> */}
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Manager"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of the role"
                value={formState.description}
                onChange={handleInputChange}
                disabled
              />
              <p className="text-xs text-gray-500">Description is not supported for role creation</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., Manager"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                name="description"
                placeholder="Brief description of the role"
                value={formState.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
