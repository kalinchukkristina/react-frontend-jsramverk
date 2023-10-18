import { gql } from "@apollo/client";

export const GET_DELAYED_TRAINS = gql`
  query {
    delayed {
      OperationalTrainNumber
      LocationSignature
      FromLocation {
        LocationName
      }
      ToLocation {
        LocationName
      }
      EstimatedTimeAtLocation
      AdvertisedTimeAtLocation
    }
  }
`;

export const GET_CODES = gql`
  query {
    codes {
      Code
      Level3Description
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      tickets {
        _id
        code
        traindate
        trainnumber
      }
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($ticketInput: TicketInput!, $userId: String!) {
    createTicket(ticketInput: $ticketInput, userId: $userId) {
      code
      trainnumber
      traindate
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($userInput: UserInput!) {
    createUser(userInput: $userInput) {
      _id
      username
    }
  }
`;

export const LOGIN_USER = gql`
  mutation ($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      message
      token
      username
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($ticketId: String!, $ticketInput: TicketInput!) {
    updateTicket(ticketId: $ticketId, ticketInput: $ticketInput) {
      _id
      code
      trainnumber
      traindate
    }
  }
`;
