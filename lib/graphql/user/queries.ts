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
      id
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
            plan{
              name
            }
        }
    }
    }
  }
`;

const GET_MEMBER_LOCATION = `
  query GetMemberLocation($memberId: String!, $date: String!) {
    getMemberLocation(memberId: $memberId, date: $date) {
      day
      leadAssingeeMemberId
      locations { 
        latitude
        longitude
        idleTime
        movingTime
        timestamp
        batteryPercentage
        networkStrength
      }
    }
  }
`;

const GET_PLANS = `
  query GetPlans {
    getPlans{
        id
        name
        duration
        defaultAllowedDeptsIds
        price
        description
        isActive
        createdAt
        updatedAt
    }
  }
`;

const GET_DEPT_FIELDS = `
  query GetDeptWFields {
      getDeptWFields{
         id
         name
         deptFields {
          id
          name
          subDeptFields {
            id
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
  }
`;

const GET_DEPT_OPT_FIELDS = `
  query GetCompanyDeptOptFields {
      getCompanyDeptOptFields{
         id
         name
        
          subDeptFields {
            id
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

export const userQueries = {
  GET_COMPANY_DEPT_MEMBERS,
  GET_COMPANIES,
  GET_MEMBERS,
  GET_MEMBER_LOCATION,
  GET_PLANS,
  GET_DEPT_FIELDS,
  GET_DEPT_OPT_FIELDS
};
