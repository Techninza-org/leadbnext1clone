const GET_DEPT_FIELDS = `
query getDeptFields($deptId: String!) {
    getDeptFields(deptId: $deptId) {
      deptFields { 
        id
        name
        fieldType
      }
    }
  }
`;

const GET_COMPANY_DEPTS = `
  query GetCompanyDepts($companyId: String!) {
    getCompanyDepts(companyId: $companyId) {
      id
      name
      companyDeptForms {
        id
        name
        subDeptFields {
          name
          fieldType
        }
      }
    }
  }
`;

export const deptQueries = {
  GET_DEPT_FIELDS,
  GET_COMPANY_DEPTS,
}