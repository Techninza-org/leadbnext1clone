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
    $userId: String!
    $deptId: String!
    $companyId: String!
    $description: String
  ) {
    leadAssignTo(
      leadIds: $leadIds
      userId: $userId
      deptId: $deptId
      companyId: $companyId
      description: $description
    ) {
       name
       LeadStatus { 
        name
        assignedTo { 
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
  ) {
    submitFeedback(
      deptId: $deptId,
      leadId: $leadId,
      callStatus: $callStatus,
      paymentStatus: $paymentStatus,
      feedback: $feedback
    ) {
      message
    }
  }
`;



export const leadMutation = {
  CREATE_LEAD,
  LEAD_ASSIGN_TO,
  SUBMIT_LEAD
} 