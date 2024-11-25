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
      }
    }
  }
`;

const GET_COMPANY_DEPT_FIELDS = `
  query GetCompanyDeptFields($deptId: String) {
    getCompanyDeptFields(deptId: $deptId) {
      id
        name
        subDeptFields { 
          name
          fieldType
          ddOptionId
          options {
              label
              value
          }
          isDisabled
          isRequired
          imgLimit
          order
        }
      }
    }
`;

export const deptQueries = {
  GET_DEPT_FIELDS,
  GET_COMPANY_DEPTS,
  GET_COMPANY_DEPT_FIELDS,
};
