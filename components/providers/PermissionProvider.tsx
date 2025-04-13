'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useManualQuery } from 'graphql-hooks'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/lib/atom/userAtom'
import { useCompany } from './CompanyProvider'
import { toast } from 'sonner'
import { userPermissionQueries } from '@/lib/graphql/permission/user-permission-queries'

// Define permission types
export type PermissionAction = 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'CRITICAL'
export type PermissionResource = 'Lead' | 'User' | 'Department' | 'Company' | 'Form' | 'Role' | 'Permission'

export interface Permission {
  id: string
  name: string
  resource: PermissionResource
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

// Define the context type
interface PermissionContextType {
  userPermissions: Permission[]
  isLoading: boolean
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean
  hasAnyPermission: (resource: PermissionResource, actions: PermissionAction[]) => boolean
  hasAllPermissions: (resource: PermissionResource, actions: PermissionAction[]) => boolean
  getResourcePermissions: (resource: PermissionResource) => Permission[]
  refreshPermissions: () => Promise<void>
}

// Create the context
const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

// Define the provider props
interface PermissionProviderProps {
  children: ReactNode
}

// GraphQL query to get user permissions
const GET_USER_PERMISSIONS = userPermissionQueries.GET_USER_PERMISSIONS

export function PermissionProvider({ children }: PermissionProviderProps) {
  const [userPermissions, setUserPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const user = useAtomValue(userAtom)
  const { companyMemberRoles } = useCompany()

  // Query to fetch user permissions
  const [getUserPermissions] = useManualQuery(GET_USER_PERMISSIONS, {
    onSuccess: ({ data }) => {
      if (data?.getPermissionsByRoleId) {
        setUserPermissions([data.getPermissionsByRoleId.permission])
      }
      setIsLoading(false)
    }
  })

  // Fetch permissions on component mount or when user/roles change
  useEffect(() => {
    if (user?.id) {
      fetchUserPermissions()
    } else {
      setUserPermissions([])
      setIsLoading(false)
    }
  }, [user?.id, companyMemberRoles])

  // Function to fetch user permissions
  const fetchUserPermissions = async () => {
    try {
      setIsLoading(true)
      await getUserPermissions()
    } catch (error) {
      console.error('Error fetching user permissions:', error)
      toast.error('Failed to load permissions')
      setIsLoading(false)
    }
  }

  // Check if user has a specific permission
  const hasPermission = (resource: PermissionResource, action: PermissionAction): boolean => {
    if (!user) return false
    
    // Root user bypass - always has all permissions
    if (user.role.name === 'ROOT') return true
    return userPermissions.some(
      permission => 
        permission.resource === resource && 
        permission.actions.includes(action)
    )
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (resource: PermissionResource, actions: PermissionAction[]): boolean => {
    if (!user) return false
    
    // Root user bypass
    if (user.role.name === 'ROOT') return true
    
    return actions.some(action => hasPermission(resource, action))
  }

  // Check if user has all of the specified permissions
  const hasAllPermissions = (resource: PermissionResource, actions: PermissionAction[]): boolean => {
    if (!user) return false
    
    // Root user bypass
    if (user.role.name === 'ROOT') return true
    
    return actions.every(action => hasPermission(resource, action))
  }

  // Get all permissions for a specific resource
  const getResourcePermissions = (resource: PermissionResource): Permission[] => {
    return userPermissions.filter(permission => permission.resource === resource)
  }

  // Refresh permissions manually
  const refreshPermissions = async (): Promise<void> => {
    await fetchUserPermissions()
  }

  // Context value
  const value: PermissionContextType = {
    userPermissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getResourcePermissions,
    refreshPermissions
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

// Custom hook to use the permission context
export function usePermission() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}

// Higher-order component for permission-based rendering
interface WithPermissionProps {
  resource: PermissionResource
  action: PermissionAction
  fallback?: React.ReactNode
}

export function WithPermission({ 
  resource, 
  action, 
  fallback = null, 
  children 
}: WithPermissionProps & { children: ReactNode }) {
  const { hasPermission } = usePermission()
  
  if (hasPermission(resource, action)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

// Button with permission check
export function PermissionButton({
  resource,
  action,
  children,
  ...props
}: WithPermissionProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  const { hasPermission } = usePermission()
  
  if (!hasPermission(resource, action)) {
    return null
  }
  
  return (
    <button {...props}>
      {children}
    </button>
  )
}