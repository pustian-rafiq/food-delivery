import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $name: String!
    $password: String!
    $email: String!
    $phone_number: String!
  ) {
    register(
      registerInput: {
        name: $name
        email: $email
        password: $password
        phone_number: $phone_number
      }
    ) {
      activationToken
    }
  }
`;
