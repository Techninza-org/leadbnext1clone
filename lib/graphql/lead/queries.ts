
const GET_COMPANY_LEADS = `
query GetCompanyLeads($companyId: String!) {
  getCompanyLeads(companyId: $companyId) {
            lead { 
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
            isLeadApproved

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
            groupedLeads {
                formName
                feedback {
                    name
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
      nextFollowUpDate
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

const GET_LAST_MONTH_ALL_LEADS = `
query GetLastMonthAllLeads {
    getLastMonthAllLeads {
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

const UPDATE_LEAD_FOLLOW_UP_DATE = `
  query UpdateLeadFollowUpDate($leadId: String!, $nextFollowUpDate: String!) {
    updateLeadFollowUpDate(leadId: $leadId, nextFollowUpDate: $nextFollowUpDate) {
      id
      nextFollowUpDate
    }
  }
`;


export const leadQueries = {
  GET_COMPANY_LEADS,
  GET_ASSIGNED_LEADS,
  GET_LEAD_BIDS_QUERY,
  GET_LAST_MONTH_ALL_LEADS,
  UPDATE_LEAD_FOLLOW_UP_DATE,
}