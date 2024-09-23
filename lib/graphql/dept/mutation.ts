const UPDATE_DEPT = `
mutation CreateNUpdateCompanyDeptForm($input: CompanyDeptFormInput!) {
    createNUpdateCompanyDeptForm(input: $input) {
      id
    name
}
}
`;

const CREATE_OR_UPDATE_GLOBAL_DEPTS = ` 
  mutation createDept($input: GlobalDeptFormInput!) {
    createDept(input: $input) {
      dept {
        id
        deptFields{
            id
            name
        }
    }
    }
  }
`;

export const DeptMutation = {
  UPDATE_DEPT,
  CREATE_OR_UPDATE_GLOBAL_DEPTS
};
