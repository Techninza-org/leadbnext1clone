const CREATE_LEAD = `
mutation createLead(
  $companyId: String!, 
  $name: String!, 
  $email: String!, 
  $address: String!, 
  $alternatePhone: String, 
  $phone: String!, 
  $city: String!, 
  $state: String!, 
  $zip: String!, 
  $rating: Int, 
  $vehicleDate: String!, 
  $vehicleModel: String!, 
  $vehicleName: String!
) {
  createLead(
    input: {
      companyId: $companyId,
      name: $name,
      email: $email,
      address: $address,
      alternatePhone: $alternatePhone,
      phone: $phone,
      city: $city,
      state: $state,
      zip: $zip,
      rating: $rating,
      vehicleDate: $vehicleDate,
      vehicleModel: $vehicleModel,
      vehicleName: $vehicleName
    }
  ) {
    lead {
      id
      name
      vehicleName
    }
  }
}
`;

const LEAD_ASSIGN_TO = `
  mutation leadAssignTo(
    $leadIds: [String!]!
    $userIds: [String!]!
    $deptId: String!
    $companyId: String!
    $description: String
  ) {
    leadAssignTo(
      leadIds: $leadIds
      userIds: $userIds
      deptId: $deptId
      companyId: $companyId
      description: $description
    ) {
      name
      LeadMember { 
          Member { 
              name
          }
      }
    }
  }
`;

const SUBMIT_LEAD = `
  mutation SubmitFeedback(
    $deptId: String!,
    $leadId: String!,
    $callStatus: String!,
    $paymentStatus: String!,
    $feedback: [FeedbackInput!]!
    $urls: [String]
  ) {
    submitFeedback(
      deptId: $deptId,
      leadId: $leadId,
      callStatus: $callStatus,
      paymentStatus: $paymentStatus,
      feedback: $feedback
      urls: $urls
    ) {
      message
    }
  }
`;

const SUBMIT_BID_MUTATION = `
  mutation SubmitBid(
    $deptId: String!,
    $leadId: String!,
    $companyId: String!,
    $bidAmount: String!,
    $description: String!
  ) {
    submitBid(
      deptId: $deptId,
      leadId: $leadId,
      companyId: $companyId,
      bidAmount: $bidAmount,
      description: $description
    ) {
      id
      bidAmount
    } 
  }`

const UPDATE_LEAD_FINANCE_STATUS = `
  mutation UpdateLeadFinanceStatus(
    $leadId: String!,
    $financeStatus: Boolean!
  ) {
    updateLeadFinanceStatus(
      leadId: $leadId,
      financeStatus: $financeStatus
    ) {
      id
      name
    }
  }
`;

export const leadMutation = {
  CREATE_LEAD,
  LEAD_ASSIGN_TO,
  SUBMIT_LEAD,
  SUBMIT_BID_MUTATION,
  UPDATE_LEAD_FINANCE_STATUS
} 