
const GET_COMPANY_LEADS = `
query GetCompanyLeads($companyId: String!) {
    getCompanyLeads(companyId: $companyId) {
      id
      name
      email
      phone
      alternatePhone
      address
      city
      state
      zip
      vehicleDate
      vehicleName
      vehicleModel
      callStatus
      paymentStatus

      LeadStatus {
        description
        assignedTo {
            name
        }
      }
    }
  }
`;

const GET_ASSIGNED_LEADS = `
query getAssignedLeads($userId: String!) {
    getAssignedLeads(userId: $userId) {
      id
      name
      email
      phone
      alternatePhone
      address
      city
      state
      zip
      vehicleDate
      vehicleName
      vehicleModel
      callStatus
      paymentStatus
      
      LeadStatus {
        description
        assignedTo {
            name
        }
      }
    }
  }
`;

export const leadQueries = {
  GET_COMPANY_LEADS,
  GET_ASSIGNED_LEADS
}