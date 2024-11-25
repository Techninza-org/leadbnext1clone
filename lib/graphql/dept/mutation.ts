const UPDATE_DEPT = `
mutation CreateNUpdateCompanyDeptForm($input: CreateDeptFormInput!) {
    createNUpdateCompanyDeptForm(input: $input) {
      id
      name
    }
}
`;

const UPDATE_DEPT_OPT = `
mutation createNUpdateCompanyDeptOptForm($input: CreateDeptFormInput!) {
    createNUpdateCompanyDeptOptForm(input: $input) {
      id
      name
    }
}
`;

const CREATE_OR_UPDATE_GLOBAL_DEPTS = ` 
  mutation createDept($input: CreateDeptInput!) {
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

const GET_BROADCAST_FORM = `
  query GetBroadcastForm {
    broadcastForm {
       id
       name
       order
       subCategories{
        id
        name
        options{
            id
            name
            values{
                id
                name
                values{
                    id
                    name
                }
            }
        }
       }
    }
  }
`;


export const DeptMutation = {
  UPDATE_DEPT,
  CREATE_OR_UPDATE_GLOBAL_DEPTS,
  GET_BROADCAST_FORM,
  UPDATE_DEPT_OPT
};
