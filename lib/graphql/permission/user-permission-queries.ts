const GET_USER_PERMISSIONS = `
  query GetUserPermissions {
    getPermissionsByRoleId
  }
`;

const CHECK_USER_PERMISSION = `
  query CheckUserPermission($resource: String!, $action: String!) {
    checkUserPermission(resource: $resource, action: $action)
  }
`;

export const userPermissionQueries = {
  GET_USER_PERMISSIONS,
  CHECK_USER_PERMISSION
};
