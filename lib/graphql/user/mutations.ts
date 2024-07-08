export const LOGIN_USER = `
  mutation loginUser($phone: String!, $otp: String!) {
    loginUser(phone: $phone, otp: $otp) {
     user {
        id
        name
        email
        deptId
        companyId
        sessionToken
        token
        role {
            id
            name
          }
        }
    }
  }
`;

export const CREATE_USER = `
mutation CreateUser(
  $name: String!,
  $email: String!,
  $phone: String!,
  $password: String!,
  $roleId: String!,
  $deptId: String!,
  $companyId: String!
) {
  createUser(
    name: $name,
    email: $email,
    phone: $phone,
    password: $password,
    roleId: $roleId,
    deptId: $deptId,
    companyId: $companyId
  ) {
    user {
      id
      email
    }
  }
}
`;