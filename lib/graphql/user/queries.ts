
const GET_COMPANY_DEPT_MEMBERS = `
  query GetCompanyDeptMembers($deptId: String, $companyId: String!) {
    getCompanyDeptMembers(deptId: $deptId, companyId: $companyId) {
      id
      name
      role { 
          name
      }
    }
  }
`;

export const userQueries = {
    GET_COMPANY_DEPT_MEMBERS
}