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
        department
        bids{
          id
          bidAmount
        }

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

const GET_PROSPECT_LEADS = `
  query GetCompanyProspects {
    getCompanyProspects {
        id
        name
        email
        callStatus
        paymentStatus
        phone
        address
        city
        state
        isLeadConverted
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
      bids{
        id
        bidAmount
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

      LeadMember {
        Member { 
            name
        }
      }
      nextFollowUpDate
      createdAt
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

const GET_LEADS_BY_DATE_RANGE = `
  query GetLeadsByDateRange($companyId: ID!, $startDate: String!, $endDate: String!) {
    getLeadsByDateRange(companyId: $companyId, startDate: $startDate, endDate: $endDate) {
      callCount
      totalPayCollectedCount
      numberOfLeads
      groupedCallPerday
      leadsWithFeedbackByRole
    }
  }
`;

const GET_TRANSFERED_LEADS = `
  query GetTransferedLeads($userId: String!) {
    getTransferedLeads(userId: $userId) {
      id
      name   
      LeadTransferTo {
           transferBy {
              id
              name
              role{
                  name
              }
           }
           transferTo {
              id
              name
              role{
                  name
              }
           }
        }
    }
  }
`;

const GET_FOLLOWUP = `
  query getFollowUpByLeadId($leadId: String!) {
    getFollowUpByLeadId(leadId: $leadId) {
      id
      followUpBy{
          name
      }
      customerResponse
      nextFollowUpDate
      rating
      leadId
      createdAt
      remark
    }
  }
`;

export const leadQueries = {
  GET_COMPANY_LEADS,
  GET_PROSPECT_LEADS,
  GET_ASSIGNED_LEADS,
  GET_LEAD_BIDS_QUERY,
  GET_LAST_MONTH_ALL_LEADS,
  UPDATE_LEAD_FOLLOW_UP_DATE,
  GET_LEADS_BY_DATE_RANGE,
  GET_TRANSFERED_LEADS,
  GET_FOLLOWUP,
};
