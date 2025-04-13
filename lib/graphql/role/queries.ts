const GET_ALL_ROLES = `
  query GetAllRoles {
    getAllRoles {
      id
      name
      description
      companyDeptForm
      createdAt
      updatedAt
    }
  }
`;

const CREATE_COMPANY_ROLE = `
  mutation CreateCompanyRole($roleName: String!) {
    createCompanyRole(roleName: $roleName)
  }
`;

export const roleQueries = {
  GET_ALL_ROLES,
  CREATE_COMPANY_ROLE,
};
