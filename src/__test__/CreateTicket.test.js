import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
  OperationalTrainNumber: "hello",
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
      {
        _id: "33333",
        code: "000",
        trainnumber: "hello",
        traindate: "2023-09-17",
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
          {
            Code: "000",
            Level3Description: "Description 000",
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
        userId: "123",
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

test("Tickets component creates a new ticket", async () => {
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

  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "2" } });

  const selectedCodeElement = screen.getByText("000 - Description 000");
  expect(selectedCodeElement).toBeInTheDocument();

  const createTicketButton = screen.getByText("Skapa nytt ärende");
  fireEvent.click(createTicketButton);

  expect(screen.getByText("000 - hello - 2023-09-17")).toBeInTheDocument();
});
