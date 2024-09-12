const UPDATE_DEPT = `
mutation CreateNUpdateCompanyDeptForm($input: CompanyDeptFormInput!) {
    createNUpdateCompanyDeptForm(input: $input) {
      id
    name
}
}
`;

export const DeptMutation = {
  UPDATE_DEPT,
};
