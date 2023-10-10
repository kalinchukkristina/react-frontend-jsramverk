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

export const GET_TICKETS = gql`
  query {
    tickets {
      code
      traindate
      trainnumber
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($ticketInput: TicketInput!) {
    createTicket(ticketInput: $ticketInput) {
      code
      trainnumber
      traindate
    }
  }
`;
