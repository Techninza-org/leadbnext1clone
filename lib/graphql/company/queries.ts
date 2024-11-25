const GET_ALL_ROLES = `
  query GetAllRoles {
    getAllRoles {
      id
      name
    }
  }
`;

const GET_COMPANY_DEPT_FIELDS = `
  query GetCompanyDeptFields($deptId: String) {
    getCompanyDeptFields(deptId: $deptId) {
      id
      name
      subDeptFields { 
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

const GET_COMPANY_SUBSCRIPTION = `
  query GetCompanySubscription($companyId: String!) {
    getCompanySubscription(companyId: $companyId) {
      id
      name
      Subscriptions {
        planId
        allowedDeptsIds
        plan{
          id
          name
        }
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

const GET_BROADCAST_BY_ID = `
  query GetBroadcastById($broadcastId: ID!){
    getBroadcastById(broadcastId: $broadcastId) {
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

const GET_BROADCAST_FORM = `
  query GetBroadcastForm {
    broadcastForm {
       id
       name
       order
       subCategories{
        name
        options{
            name
            order
            type
            values{
                id
                name
                values{
                    id
                    name
                }
            }
        }
       }
    }
}
`;

const GET_COMPANY_XCHANGER_BIDS_QUERY = `
  query GetCompanyXchangerBids {
    getCompanyXchangerBids {
      id
      bidAmount
      isApproved
      description
      Member {
        name
      }
      lead {
        name
      }
      createdAt
      updatedAt
    }
  }
`

const GET_FOLLOWUP = `
  query GetFollowUps {
    getFollowUps {
      id
      nextFollowUpDate
      remark
      customerResponse
      rating
      leadId
      followUpById
      followUpBy{
        name
      }
      createdAt
      updatedAt
    }
  }
`

const XCHANGE_CUSTOMER_LIST = `
    query XChangerCustomerList {
      xChangerCustomerList {
        data
      }
    }
`
const GET_XCHANGE_LEAD_IMGS = `
    query GetExchangeLeadImgs {
      getExchangeLeadImgs {
        data
      }
    }
`
const GET_LEADS_PHOTOS = `
    query GetLeadPhotos {
      getLeadPhotos {
        data
      }
    }
`

const GET_PAYMENT_LIST = `
    query PaymentList {
      paymentList {
        data
      }
    }
`

export const companyQueries = {
  XCHANGE_CUSTOMER_LIST,
  GET_ALL_ROLES,
  GET_FOLLOWUP,
  GET_COMPANY_DEPT_FIELDS,
  GET_COMPANY_SUBSCRIPTION,
  GET_BROADCASTS,
  GET_BROADCAST_BY_ID,
  GET_BROADCAST_FORM,
  GET_COMPANY_XCHANGER_BIDS_QUERY,
  GET_XCHANGE_LEAD_IMGS,
  GET_LEADS_PHOTOS,
  GET_PAYMENT_LIST,
}