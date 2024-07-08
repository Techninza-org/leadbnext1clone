const GET_ALL_ROLES = `
  query GetAllRoles {
    getAllRoles {
      id
      name
    }
  }
`;

const GET_COMPANY_DEPT_FIELDS = `
  query GetCompanyDeptFields($deptId: String!) {
    getCompanyDeptFields(deptId: $deptId) {
      id
      name
      subDeptFields {
        name
        fieldType
      }
    }
  }
`;

export const companyQueries = {
  GET_ALL_ROLES,
  GET_COMPANY_DEPT_FIELDS
}