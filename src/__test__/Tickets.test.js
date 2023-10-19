import React from "react";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Tickets from "./../components/Tickets";
import { GET_CODES } from "../queries";
import { GET_USER } from "../queries";
import { CREATE_TICKET } from "../queries";

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const sampleSelectedTrain = {
  OperationalTrainNumber: "1403",
  EstimatedTimeAtLocation: "2023-09-17",
};
const userId = "123";
const userTickets = {
  user: {
    tickets: [
      {
        _id: "1111",
        code: "123",
        trainnumber: "1403",
        traindate: "2023-09-17",
      },
      {
        _id: "222222",
        code: "456",
        trainnumber: "1404",
        traindate: "2023-09-18",
      },
    ],
  },
};

const mocks = [
  {
    request: {
      query: GET_CODES,
    },
    result: {
      data: {
        codes: [
          {
            Code: "123",
            Level3Description: "Description 123",
          },
          {
            Code: "456",
            Level3Description: "Description 456",
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_USER,
      variables: {
        id: "123",
      },
    },
    result: {
      data: {
        user: {
          tickets: [
            {
              _id: "1111",
              code: "123",
              trainnumber: "1403",
              traindate: "2023-09-17",
            },
            {
              _id: "222222",
              code: "456",
              trainnumber: "1404",
              traindate: "2023-09-18",
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_TICKET,
      variables: {
        ticketInput: {
          code: "000",
          trainnumber: "hello",
          traindate: "2023-09-17",
        },
      },
    },
    result: {
      data: {
        createTicket: {
          code: "000",
          trainnumber: "hello",
          traindate: "2023-09-17",
        },
      },
    },
  },
];

test("Tickets component renders correctly", async () => {
  localStorage.setItem("token", "your-auth-token");

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Tickets
        selectedTrain={sampleSelectedTrain}
        userId={userId}
        userTickets={userTickets}
      />
    </MockedProvider>
  );

  await screen.findByText("Befintliga ärenden");

  expect(screen.getByText("Orsakskod:")).toBeInTheDocument();

  expect(screen.getByRole("combobox")).toBeInTheDocument();
});
