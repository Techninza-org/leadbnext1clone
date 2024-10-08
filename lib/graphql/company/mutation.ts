const UPDATE_COMPANY_SUBSCRIPTION = `
mutation updateCompanySubscription(
    $companyId: String!
    $planId: String!
    $allowedDeptsIds: [String!]!
    $startDate: String!
    $endDate: String!
) {
    updateCompanySubscription(
        companyId: $companyId
        planId: $planId
        allowedDeptsIds: $allowedDeptsIds
        startDate: $startDate
        endDate: $endDate
    ) {
        id
        name
    }
}
`;

const DELETE_BROADCAST = `
mutation deleteBroadcast($broadcastId: ID!) {
    deleteBroadcast(broadcastId: $broadcastId) {
        id
    }
}`;

const UPDATE_BROADCAST_FORM = `
  mutation updateBroadcastForm($input: [CreateBroadcastInput!]!) {
    updateBroadcastForm(input: $input) {
      id
      name
      subCategories {
        name
        options {
          name
          type
          values {
            name
            values {
              name
            }
          }
        }
      }
    }
  }
`;

export const companyMutation = {
  UPDATE_COMPANY_SUBSCRIPTION,
  DELETE_BROADCAST,
  UPDATE_BROADCAST_FORM,
}