import React from "react";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Tickets from "./../components/Tickets";
import { GET_CODES } from "../queries";
import { GET_TICKETS } from "../queries";

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
        ],
      },
    },
  },
];

test("Tickets component renders correctly and handles ticket creation", async () => {
  localStorage.setItem("token", "your-auth-token");

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Tickets selectedTrain={sampleSelectedTrain} />
    </MockedProvider>
  );

  await screen.findByText("Befintliga ärenden");

  expect(screen.getByText("Orsakskod:")).toBeInTheDocument();

  expect(screen.getByRole("combobox")).toBeInTheDocument();
});
