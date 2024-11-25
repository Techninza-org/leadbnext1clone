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
  $department: String
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
      department: $department
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
    $deptId: String
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
    $nextFollowUpDate: String,
    $deptId: String!,
    $leadId: String!,
    $callStatus: String!,
    $paymentStatus: String!,
    $feedback: [FeedbackInput!]!
    $urls: [String]
    $submitType: String
    $formName: String
  ) {
    submitFeedback(
      nextFollowUpDate: $nextFollowUpDate,
      deptId: $deptId,
      leadId: $leadId,
      callStatus: $callStatus,
      paymentStatus: $paymentStatus,
      feedback: $feedback
      urls: $urls
      submitType: $submitType
      formName: $formName
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

const APPROVED_LEAD_MUTATION = `
  mutation appvedLead($leadId: ID!, $status: Boolean!) {
    appvedLead(
      leadId: $leadId
      status: $status
    ) {
      id
      name
    }
  }
`;

const TRANSFER_LEAD  = `
mutation TransferLead(
  $leadId: ID!,
  $transferToId: ID!
) {
  leadTransferTo(
      leadId: $leadId,
      transferToId: $transferToId,
  ) {
      id
      email
      name
  }
}
`

const UPDATE_FOLLOWUP = `
  mutation updateLeadFollowUpDate(
    $leadId: String!,
    $nextFollowUpDate: String!,
    $rating: String!,
    $customerResponse: String!,
    $remark: String!
  ) {
    updateLeadFollowUpDate(
      leadId: $leadId,
      nextFollowUpDate: $nextFollowUpDate,
      rating: $rating,
      customerResponse: $customerResponse,
      remark: $remark
    ) {
      id
      name
    }
  }
`

export const leadMutation = {
  CREATE_LEAD,
  LEAD_ASSIGN_TO,
  SUBMIT_LEAD,
  SUBMIT_BID_MUTATION,
  UPDATE_LEAD_FINANCE_STATUS,
  APPROVED_LEAD_MUTATION,
  TRANSFER_LEAD,
  UPDATE_FOLLOWUP
} 