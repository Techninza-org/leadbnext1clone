const GET_COMPANY_DEPT_MEMBERS = `
  query GetCompanyDeptMembers($deptId: String, $companyId: String!) {
    getCompanyDeptMembers(deptId: $deptId, companyId: $companyId) {
      id
      name
      email
      phone
      role { 
          name
      }
    }
  }
`;

const GET_MEMBERS = `
  query GetMembersByRole($role: String!) {
    getMembersByRole(role: $role) {
      name
      companyId
    }
  }
`

const GET_COMPANIES = `
  query getRootUsers {
    getRootUsers {
      id
      name
      Company { 
        id
        name
        phone
        email
        Subscriptions {
            planId
        }
    }
    }
  }
`;

const GET_MEMBER_LOCATION = `
  query GetMemberLocation($memberId: String!, $date: String) {
    getMemberLocation(memberId: $memberId, date: $date) {
      day
      leadAssingeeMemberId
      locations { 
        latitude
        longitude
        idleTime
        movingTime
        timestamp
      }
    }
  }
`;

export const userQueries = {
  GET_COMPANY_DEPT_MEMBERS,
  GET_COMPANIES,
  GET_MEMBERS,
  GET_MEMBER_LOCATION
};
