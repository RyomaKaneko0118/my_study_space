import gql from 'graphql-tag'

export const queries = {
  getLecturerDetailFinancialYears: gql`
    query {
      lecturerDetailFinancialYears
    }
  `,
  getLecturerDetails: gql`
    query ($financialYear: Int!, $name: String, $includeArchived: Boolean) {
      lecturerDetails(
        financialYear: $financialYear
        name: $name
        includeArchived: $includeArchived
      ) {
        lecturer {
          id
          firstName
          lastName
          businessName
          lecturerContract {
            type
          }
        }
        lecturerFees {
          label
          fee
        }
      }
    }
  `
}
