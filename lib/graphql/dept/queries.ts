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
  query GetCompanyDepts($companyId: String) {
    getCompanyDepts(companyId: $companyId) {
      id
      name
      companyForms {
        id
        name
        category {
          name
        }
      }
    }
  }
`;

const GET_COMPANY_DEPT_FIELDS = `
  query GetCompanyDeptFields($deptId: String) {
    getCompanyDeptFields(deptId: $deptId) {
      id
        name
        dependentOnId
        fields { 
          name
          fieldType
          ddOptionId
          options {
              label
              value
              colorCode
          }
          isDisabled
          isRequired
          imgLimit
          order
        }
      }
    }
`;

const CREATE_DEPT_COMPANY = `
  mutation CreateDeptCompany($deptName: String!, $deptManagerId: String!) {
    createDeptCompany(deptName: $deptName, deptManagerId: $deptManagerId)
  }
`;

export const deptQueries = {
  GET_DEPT_FIELDS,
  GET_COMPANY_DEPTS,
  GET_COMPANY_DEPT_FIELDS,
  CREATE_DEPT_COMPANY,
};
