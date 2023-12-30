import gql from 'graphql-tag'

export const mutations = {
  createTrainingClassification: gql`
    mutation (
      $createTrainingClassificationInput: CreateTrainingClassificationInput!
    ) {
      createTrainingClassification(
        createTrainingClassificationInput: $createTrainingClassificationInput
      ) {
        id
      }
    }
  `,
  updateTrainingClassification: gql`
    mutation (
      $updateTrainingClassificationInput: UpdateTrainingClassificationInput!
    ) {
      updateTrainingClassification(
        updateTrainingClassificationInput: $updateTrainingClassificationInput
      ) {
        id
      }
    }
  `,
  deleteTrainingClassification: gql`
    mutation ($id: Int!) {
      deleteTrainingClassification(id: $id)
    }
  `
}
