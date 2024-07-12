
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

      LeadMember {
          id
        Member {
            name
        }
      }
      LeadFeedback {
        id
        memberId
        member {
            name
            role {
                name
            }
        }
        imageUrls
        feedback {
            id
            name
            fieldType
            value
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

      LeadMember {
        Member { 
            name
        }
      }
    }
  }
`;

const GET_LEAD_BIDS_QUERY = `
  query GetLeadBids($leadId: String!) {
    getLeadBids(leadId: $leadId) {
      bidAmount
      Member {
        id
        name
      }
    }
  }
`;


export const leadQueries = {
  GET_COMPANY_LEADS,
  GET_ASSIGNED_LEADS,
  GET_LEAD_BIDS_QUERY
}