'use client'

import { useState, useEffect } from 'react'
import { useManualQuery, useMutation } from 'graphql-hooks'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import { deptQueries } from '@/lib/graphql/dept/queries'
import { userQueries } from '@/lib/graphql/user/queries'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// GraphQL queries and mutations
const GET_ALL_DEPARTMENTS = `
  query GetAllDepartments {
    getAllDepartments {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`

const CREATE_DEPARTMENT = `
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`

const UPDATE_DEPARTMENT = `
  mutation UpdateDepartment($id: String!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      description
      updatedAt
    }
  }
`

const DELETE_DEPARTMENT = `
  mutation DeleteDepartment($id: String!) {
    deleteDepartment(id: $id) {
      id
      name
    }
  }
`

interface Department {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  role?: {
    name: string
  }
}

export function DepartmentManagement() {
  // State
  const [departments, setDepartments] = useState<Department[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

  // Form state
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    managerId: ''
  })

  // Permission hook
  const { hasPermission } = usePermission()
  // @ts-ignore
  const { company } = useCompany()

  // GraphQL queries
  const [getDepartments] = useManualQuery(deptQueries.GET_COMPANY_DEPTS, {
    onSuccess: ({ data }) => {
      if (data?.getCompanyDepts) {
        setDepartments(data.getCompanyDepts)
      }
      setLoading(false)
    }
  })

  // Get all members for manager selection
  const [getMembers] = useManualQuery(userQueries.GET_COMPANY_DEPT_MEMBERS, {
    variables: { companyId: company?.id },
    onSuccess: ({ data }) => {
      if (data?.getCompanyDeptMembers) {
        setMembers(data.getCompanyDeptMembers)
      }
      setMembersLoading(false)
    }
  })

  const [createDepartment, { loading: createLoading }] = useMutation(deptQueries.CREATE_DEPT_COMPANY, {
    onSuccess: ({ data }) => {
      if (data?.createDeptCompany) {
        // Refresh departments after creation
        fetchDepartments()
        toast.success('Department created successfully')
        resetForm()
        setIsCreateDialogOpen(false)
      }
    }
  })

  const [updateDepartment, { loading: updateLoading }] = useMutation(UPDATE_DEPARTMENT, {
    onSuccess: ({ data }) => {
      if (data?.updateDepartment) {
        setDepartments(departments.map(dept =>
          dept.id === data.updateDepartment.id ? data.updateDepartment : dept
        ))
        toast.success('Department updated successfully')
        resetForm()
        setIsEditDialogOpen(false)
        setSelectedDepartment(null)
      }
    }
  })

  const [deleteDepartment, { loading: deleteLoading }] = useMutation(DELETE_DEPARTMENT, {
    onSuccess: ({ data }) => {
      if (data?.deleteDepartment) {
        setDepartments(departments.filter(dept => dept.id !== data.deleteDepartment.id))
        toast.success('Department deleted successfully')
      }
    }
  })

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
    fetchMembers()
  }, [])

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true)
    await getDepartments()
  }

  // Fetch members for manager selection
  const fetchMembers = async () => {
    setMembersLoading(true)
    await getMembers()
  }

  // Reset form state
  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      managerId: ''
    })
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  // Handle manager selection
  const handleManagerChange = (value: string) => {
    setFormState({
      ...formState,
      managerId: value
    })
  }

  // Handle create department
  const handleCreateDepartment = async () => {
    if (!formState.name) {
      toast.error('Department name is required')
      return
    }

    if (!formState.managerId) {
      toast.error('Department manager is required')
      return
    }

    await createDepartment({
      variables: {
        deptName: formState.name,
        deptManagerId: formState.managerId
      }
    })
  }

  // Handle edit department
  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department)
    setFormState({
      name: department.name,
      description: department.description,
      managerId: ''
    })
    setIsEditDialogOpen(true)
  }

  // Handle update department
  const handleUpdateDepartment = async () => {
    if (!selectedDepartment || !formState.name) {
      toast.error('Department name is required')
      return
    }

    await updateDepartment({
      variables: {
        id: selectedDepartment.id,
        input: {
          name: formState.name,
          description: formState.description
        }
      }
    })
  }

  // Handle delete department
  const handleDeleteDepartment = async (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      await deleteDepartment({
        variables: { id }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Departments</h2>
        {/* {hasPermission('Department', 'CREATE') && ( */}
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Department
        </Button>
        {/* )} */}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-4">No departments found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(department => (
            <Card key={department.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{department.name}</span>
                  <div className="flex space-x-1">
                    {hasPermission('Department', 'UPDATE') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDepartment(department)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {hasPermission('Department', 'DELETE') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{department.description || 'No description'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Department Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department to your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Marketing"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of the department"
                value={formState.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerId">Department Manager</Label>
              {membersLoading ? (
                <div className="text-sm text-gray-500">Loading members...</div>
              ) : (
                <Select
                  value={formState.managerId}
                  onValueChange={handleManagerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.email ? `(${member.email})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment} disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="e.g., Marketing"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                name="description"
                placeholder="Brief description of the department"
                value={formState.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment} disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
