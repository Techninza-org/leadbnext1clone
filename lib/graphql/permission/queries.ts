const GET_ALL_PERMISSIONS = `
  query GetAllPermissions {
    getAllPermissions {
      id
      name
      resource
      actions
      roles
      createdAt
      updatedAt
    }
  }
`;

const GET_PERMISSION_BY_ID = `
  query GetPermissionById($id: String!) {
    getPermissionById(id: $id) {
      id
      name
      resource
      actions
      createdAt
      updatedAt
    }
  }
`;

const GET_PERMISSIONS_BY_ROLE = `
  query GetPermissionsByRole($roleId: String!) {
    getPermissionsByRole(roleId: $roleId) {
      id
      name
      resource
      actions
      createdAt
      updatedAt
    }
  }
`;

const CREATE_PERMISSION = `
  mutation CreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      id
      name
      resource
      actions
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PERMISSION = `
  mutation UpdatePermission($id: String!, $input: UpdatePermissionInput!) {
    updatePermission(id: $id, input: $input) {
      id
      name
      resource
      actions
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PERMISSION = `
  mutation DeletePermission($id: String!) {
    deletePermission(id: $id) {
      id
      name
    }
  }
`;

const ASSIGN_PERMISSION_TO_ROLE = `
  mutation AssignPermissionToRole($roleId: String!, $permissionId: String!) {
    assignPermissionToRole(roleId: $roleId, permissionId: $permissionId) 
  }
`;

const REMOVE_PERMISSION_FROM_ROLE = `
  mutation RemovePermissionFromRole($roleId: String!, $permissionId: String!) {
    removePermissionFromRole(roleId: $roleId, permissionId: $permissionId) 
  }
`;

export const permissionQueries = {
  GET_ALL_PERMISSIONS,
  GET_PERMISSION_BY_ID,
  GET_PERMISSIONS_BY_ROLE,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  ASSIGN_PERMISSION_TO_ROLE,
  REMOVE_PERMISSION_FROM_ROLE,
};
