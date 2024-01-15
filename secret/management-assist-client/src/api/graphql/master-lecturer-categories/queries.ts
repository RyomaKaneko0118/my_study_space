import gql from 'graphql-tag'

export const queries = {
  getMasterLecturerCategories: gql`
    query {
      masterLecturerCategories {
        id
        name
      }
    }
  `
}
