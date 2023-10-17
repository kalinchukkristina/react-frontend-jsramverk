import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Tickets from "./../components/Tickets";
import { GET_CODES } from "../queries";
import { GET_TICKETS } from "../queries";
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
      query: GET_TICKETS,
    },
    result: {
      data: {
        tickets: [
          {
            code: "123",
            trainnumber: "1403",
            traindate: "2023-09-17",
          },
          {
            code: "456",
            trainnumber: "1404",
            traindate: "2023-09-18",
          },
          {
            code: "000",
            trainnumber: "hello",
            traindate: "2023-09-17",
          },
        ],
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

test("Tickets component  create a new ticket", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Tickets selectedTrain={sampleSelectedTrain} />
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
