const GET_ALL_ROLES = `
  query GetAllRoles {
    getAllRoles {
      id
      name
    }
  }
`;

const GET_COMPANY_DEPT_FIELDS = `
  query GetCompanyDeptFields($deptId: String!) {
    getCompanyDeptFields(deptId: $deptId) {
      id
      name
      subDeptFields { 
        name
        fieldType
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

const GET_COMPANY_SUBSCRIPTION = `
  query GetCompanySubscription($companyId: String!) {
    getCompanySubscription(companyId: $companyId) {
      id
      name
      Subscriptions {
        planId
      } 
    }
  }
`;

const GET_BROADCASTS = `
  query GetBroadcasts {
    getBroadcasts {
      id
      message
      companyId
      isOffer
      isTemplate
      isMessage
      imgURL
      createdAt
    }
  }
`;

export const companyQueries = {
  GET_ALL_ROLES,
  GET_COMPANY_DEPT_FIELDS,
  GET_COMPANY_SUBSCRIPTION,
  GET_BROADCASTS
}