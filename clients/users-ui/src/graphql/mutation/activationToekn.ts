import { gql } from "@apollo/client";

export const ACTIVATE_USER = gql`
  mutation ActivateUser($activationToken: String!, $activationCode: String!) {
    activateUser(
      activationInput: {
        activationToken: $activationToken
        activationCode: $activationCode
      }
    ) {
      user {
        name
        email
        password
        phone_number
      }
    }
  }
`;
