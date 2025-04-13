'use client'

import { useEffect, useState } from 'react'
import { useManualQuery, useMutation } from 'graphql-hooks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCompany } from '../providers/CompanyProvider'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from "sonner"
import { permissionQueries } from '@/lib/graphql/permission/queries'

// Define types based on the Prisma schema
type PermissionAction = 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'CRITICAL'

interface Permission {
  id: string
  name: string
  resource: string
  actions: PermissionAction[]
  roles?: {
    id: string
    roleId: string
    permissionId: string
    createdAt: string
    updatedAt: string
  }[]
  createdAt: string
  updatedAt: string
}

interface Role {
  id: string
  name: string
  permissions?: Permission[]
}

// Available resources for permissions
const AVAILABLE_RESOURCES = [
  'Lead',
  'User',
  'Department',
  'Company',
  'Form',
  'Role',
  'Permission'
]

export function PermissionManagement() {
  // State
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    resource: '',
    actions: [] as PermissionAction[]
  })

  // GraphQL queries
  const [getPermissions] = useManualQuery(permissionQueries.GET_ALL_PERMISSIONS, {
    onSuccess: ({ data }) => {
      if (data?.getAllPermissions) {
        setPermissions(data.getAllPermissions)
        
        // Update roles with permissions data
        if (companyMemberRoles) {
          const updatedRoles = companyMemberRoles.map((role: any) => {
            const rolePermissions = data.getAllPermissions.filter(
              (permission: Permission) => permission.roles?.some(r => r.roleId === role.id)
            );
            return {
              ...role,
              permissions: rolePermissions
            };
          });
          setRoles(updatedRoles);
        }
      }
      setLoading(false)
    },
    // onError: (error) => {
    //   console.error('Error fetching permissions:', error)
    //   toast.error('Failed to load permissions')
    //   setLoading(false)
    // }
  })

  const [createPermission, { loading: createLoading }] = useMutation(permissionQueries.CREATE_PERMISSION, {
    onSuccess: ({ data }) => {
      if (data?.createPermission) {
        setPermissions([...permissions, data.createPermission])
        toast.success('Permission created successfully')
        resetForm()
        setIsCreateDialogOpen(false)
      }
    },
    // onError: (error) => {
    //   console.error('Error creating permission:', error)
    //   toast.error('Failed to create permission')
    // }
  })

  const [updatePermission, { loading: updateLoading }] = useMutation(permissionQueries.UPDATE_PERMISSION, {
    onSuccess: ({ data }) => {
      if (data?.updatePermission) {
        setPermissions(permissions.map(p => 
          p.id === data.updatePermission.id ? data.updatePermission : p
        ))
        toast.success('Permission updated successfully')
        resetForm()
        setIsEditDialogOpen(false)
        setSelectedPermission(null)
      }
    },
    // onError: (error) => {
    //   console.error('Error updating permission:', error)
    //   toast.error('Failed to update permission')
    // }
  })

  const [deletePermission, { loading: deleteLoading }] = useMutation(permissionQueries.DELETE_PERMISSION, {
    onSuccess: ({ data }) => {
      if (data?.deletePermission) {
        setPermissions(permissions.filter(p => p.id !== data.deletePermission.id))
        toast.success('Permission deleted successfully')
      }
    },
    // onError: (error) => {
    //   console.error('Error deleting permission:', error)
    //   toast.error('Failed to delete permission')
    // }
  })

  const [assignPermission, { loading: assignLoading }] = useMutation(permissionQueries.ASSIGN_PERMISSION_TO_ROLE, {
    onSuccess: ({ data }) => {
      if (data?.assignPermissionToRole) {
        toast.success('Permission assigned to role successfully')
        setIsAssignDialogOpen(false)
      }
    },
    // onError: (error) => {
    //   console.error('Error assigning permission:', error)
    //   toast.error('Failed to assign permission')
    // }
  })

  const [removePermission, { loading: removeLoading }] = useMutation(permissionQueries.REMOVE_PERMISSION_FROM_ROLE, {
    onSuccess: ({ data }) => {
      if (data?.removePermissionFromRole) {
        toast.success('Permission removed from role')
      }
    },
    // onError: (error) => {
    //   console.error('Error removing permission:', error)
    //   toast.error('Failed to remove permission')
    // }
  })

  // Get company roles from context
  const { companyMemberRoles } = useCompany()

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions()
    if (companyMemberRoles) {
      setRoles(companyMemberRoles)
    }
  }, [companyMemberRoles])

  // Fetch permissions
  const fetchPermissions = async () => {
    setLoading(true)
    await getPermissions()
  }

  // Reset form state
  const resetForm = () => {
    setFormState({
      name: '',
      resource: '',
      actions: []
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  // Handle resource selection
  const handleResourceChange = (value: string) => {
    setFormState({
      ...formState,
      resource: value
    })
  }

  // Handle action checkbox changes
  const handleActionChange = (action: PermissionAction, checked: boolean) => {
    if (checked) {
      setFormState({
        ...formState,
        actions: [...formState.actions, action]
      })
    } else {
      setFormState({
        ...formState,
        actions: formState.actions.filter(a => a !== action)
      })
    }
  }

  // Handle create permission
  const handleCreatePermission = async () => {
    if (!formState.name || !formState.resource || formState.actions.length === 0) {
      toast.error('Please fill all required fields')
      return
    }

    await createPermission({
      variables: {
        input: {
          name: formState.name,
          resource: formState.resource,
          actions: formState.actions
        }
      }
    })
  }

  // Handle edit permission
  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setFormState({
      name: permission.name,
      resource: permission.resource,
      actions: permission.actions
    })
    setIsEditDialogOpen(true)
  }

  // Handle update permission
  const handleUpdatePermission = async () => {
    if (!selectedPermission || !formState.name || !formState.resource || formState.actions.length === 0) {
      toast.error('Please fill all required fields')
      return
    }

    await updatePermission({
      variables: {
        id: selectedPermission.id,
        input: {
          name: formState.name,
          resource: formState.resource,
          actions: formState.actions
        }
      }
    })
  }

  // Handle delete permission
  const handleDeletePermission = async (id: string) => {
    if (confirm('Are you sure you want to delete this permission?')) {
      await deletePermission({
        variables: { id }
      })
    }
  }

  // Handle assign permission to role
  const handleAssignPermission = async (permissionId: string) => {
    if (!selectedRole) {
      toast.error('Please select a role')
      return
    }

    await assignPermission({
      variables: {
        roleId: selectedRole,
        permissionId
      }
    })
  }

  // Handle remove permission from role
  const handleRemovePermission = async (roleId: string, permissionId: string) => {
    await removePermission({
      variables: {
        roleId,
        permissionId
      }
    })
  }

  // Render action badges
  const renderActionBadges = (actions: PermissionAction[]) => {
    return actions.map(action => (
      <Badge key={action} variant="secondary" className="mr-1">
        {action}
      </Badge>
    ))
  }

  return (
    <div className="space-y-6">
      <Toaster />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Permissions</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Permission
        </Button>
      </div>

      <Tabs defaultValue="permissions">
        <TabsList>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="permissions" className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading permissions...</div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-4">No permissions found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissions.map(permission => (
                <Card key={permission.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{permission.name}</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPermission(permission)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePermission(permission.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                    <Badge>{permission.resource}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {renderActionBadges(permission.actions)}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPermission(permission)
                          setIsAssignDialogOpen(true)
                        }}
                      >
                        Assign to Role
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          {roles.length === 0 ? (
            <div className="text-center py-4">No roles found.</div>
          ) : (
            <div className="space-y-6">
              {roles.map(role => (
                <Card key={role.id}>
                  <CardHeader>
                    <CardTitle>{role.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium mb-2">Permissions:</h3>
                    {role.permissions && role.permissions.length > 0 ? (
                      <div className="space-y-2">
                        {role.permissions.map(permission => (
                          <div key={permission.id} className="flex justify-between items-center p-2 border rounded-md">
                            <div>
                              <div className="font-medium">{permission.name}</div>
                              <div className="text-sm text-gray-500">{permission.resource}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {renderActionBadges(permission.actions)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const rolePermission = permission.roles?.find(r => r.roleId === role.id);
                                if (rolePermission) {
                                  handleRemovePermission(role.id, permission.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">No permissions assigned.</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Permission Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
            <DialogDescription>
              Define a new permission for your system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Manage Leads"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource">Resource</Label>
              <Select
                value={formState.resource}
                onValueChange={handleResourceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_RESOURCES.map(resource => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'CRITICAL'] as PermissionAction[]).map(action => (
                  <div key={action} className="flex items-center space-x-2">
                    <Checkbox
                      id={`action-${action}`}
                      checked={formState.actions.includes(action)}
                      onCheckedChange={(checked) => 
                        handleActionChange(action, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`action-${action}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {action}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePermission} disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the permission details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Permission Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., Manage Leads"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-resource">Resource</Label>
              <Select
                value={formState.resource}
                onValueChange={handleResourceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_RESOURCES.map(resource => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'CRITICAL'] as PermissionAction[]).map(action => (
                  <div key={action} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-action-${action}`}
                      checked={formState.actions.includes(action)}
                      onCheckedChange={(checked) => 
                        handleActionChange(action, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`edit-action-${action}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {action}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePermission} disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Permission Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Permission to Role</DialogTitle>
            <DialogDescription>
              Select a role to assign this permission to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPermission && (
              <div className="p-3 border rounded-md">
                <div className="font-medium">{selectedPermission.name}</div>
                <Badge className="mt-1">{selectedPermission.resource}</Badge>
                <div className="flex flex-wrap gap-1 mt-2">
                  {renderActionBadges(selectedPermission.actions)}
                </div>
                {selectedPermission.roles && selectedPermission.roles.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-1">Currently assigned to:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPermission.roles.map(roleRelation => {
                        const role = roles.find(r => r.id === roleRelation.roleId);
                        return role ? (
                          <Badge key={roleRelation.id} variant="outline">
                            {role.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedPermission && handleAssignPermission(selectedPermission.id)} 
              disabled={assignLoading || !selectedRole}
            >
              {assignLoading ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
