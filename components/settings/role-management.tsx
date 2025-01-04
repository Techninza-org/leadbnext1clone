'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from 'lucide-react'
// import { AddFormDialog } from './add-form-dialog'
import { useCompany } from '../providers/CompanyProvider'
import { useModal } from '@/hooks/use-modal-store'
// import { removeFormFromRole } from '../actions/role-actions'

type Role = {
    id: number
    name: string
    companyDeptForm: string[]
}

// { initialRoles }: { initialRoles: Role[] }
export function RoleManagement() {
    const initialRoles = [
        { id: 1, name: 'Admin', companyDeptForm: ['Form 1', 'Form 2'] },
        { id: 2, name: 'Manager', companyDeptForm: ['Form 3'] },
        { id: 3, name: 'User', companyDeptForm: ['Form 4'] },
    ]

    const { companyMemberRoles } = useCompany()
    const [roles, setRoles] = useState<any[]>(companyMemberRoles || [])
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const router = useRouter()
    const { onOpen } = useModal()

    useEffect(() => {
        setRoles(companyMemberRoles || [])
    }, [companyMemberRoles])

    const handleRemoveForm = async (roleId: number, formName: string) => {
        const updatedRoles = roles.map(role => {
            if (role.id === roleId) {
                return { ...role, companyDeptForm: role.companyDeptForm.filter((f: any) => f !== formName) }
            }
            return role
        })
        setRoles(updatedRoles)
        // await removeFormFromRole(roleId, formName)
        router.refresh()
    }

    const handleAddForm = (roleId: number, formName: string) => {
        const updatedRoles = roles.map(role => {
            if (role.id === roleId) {
                return { ...role, companyDeptForm: [...role.companyDeptForm, formName] }
            }
            return role
        })
        setRoles(updatedRoles)
        router.refresh()
    }

    return (
        <div className="space-y-4">
            {roles.map(role => (
                <Card key={role.id}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            {role.name}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onOpen("assignForm")}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Form
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {role?.companyDeptForm?.map((form: any) => (
                                <Badge key={form} variant="secondary" className="flex items-center">
                                    {form.name}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2 h-4 w-4 p-0"
                                        onClick={() => handleRemoveForm(role.id, form)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {/* <AddFormDialog
                role={selectedRole}
                onClose={() => setSelectedRole(null)}
                onAddForm={handleAddForm}
            /> */}
        </div>
    )
}

