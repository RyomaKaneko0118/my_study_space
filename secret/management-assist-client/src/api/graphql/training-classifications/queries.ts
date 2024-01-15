import gql from 'graphql-tag'

export const queries = {
  getTrainingClassifications: gql`
    query ($customerDetailId: Int!) {
      trainingClassifications(customerDetailId: $customerDetailId) {
        id
        customerDetailId
        departmentId
        type
        trainingDays
        sales
        note
        trainingClassificationCoordinators {
          id
          trainingClassificationId
          coordinatorId
          role
          coordinator {
            id
            saUserId
          }
        }
        trainingClassificationManagers {
          id
          trainingClassificationId
          managerId
          role
          manager {
            id
            firstName
            lastName
          }
        }
      }
    }
  `,
  getTrainingClassification: gql`
    query ($id: Int!) {
      trainingClassification(id: $id) {
        id
        customerDetailId
        departmentId
        type
        trainingDays
        sales
        note
        trainingClassificationCoordinators {
          id
          trainingClassificationId
          coordinatorId
          role
          coordinator {
            id
            saUserId
          }
        }
        trainingClassificationManagers {
          id
          trainingClassificationId
          managerId
          role
          manager {
            id
            firstName
            lastName
          }
        }
      }
    }
  `
}
