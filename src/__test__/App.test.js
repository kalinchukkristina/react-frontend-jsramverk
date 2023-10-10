import React from "react";
import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import io from "socket.io-client";
import App from "../App";
import { GET_DELAYED_TRAINS } from "../queries";
import { MockedProvider } from "@apollo/client/testing";

const mockFetchData = jest.fn(() => Promise.resolve(sampleTrains));
const mockHandleTrainClick = jest.fn();
const mockHandleReturnClick = jest.fn();

const sampleTrains = {
  data: {
    delayed: [
      {
        OperationalTrainNumber: "1403",
        LocationSignature: "Karl",
        FromLocation: [{ LocationName: "A" }],
        ToLocation: [{ LocationName: "B" }],
        EstimatedTimeAtLocation: "2023-10-10T15:05:00.000+02:00",
        AdvertisedTimeAtLocation: "2023-10-11T15:05:00.000+02:00",
      },
    ],
  },
};

const mocks = [
  {
    request: {
      query: GET_DELAYED_TRAINS,
    },
    result: {
      data: {
        delayed: [
          {
            OperationalTrainNumber: "1403",
            LocationSignature: "Karl",
            FromLocation: [{ LocationName: "A" }],
            ToLocation: [{ LocationName: "B" }],
            EstimatedTimeAtLocation: "2023-10-10T15:05:00.000+02:00",
            AdvertisedTimeAtLocation: "2023-10-11T15:05:00.000+02:00",
          },
        ],
      },
    },
  },
];

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  mockHandleTrainClick.mockClear();
  mockHandleReturnClick.mockClear();
  fetchMock.resetMocks();

  jest.spyOn(io, "connect").mockImplementation(() => {
    return {
      on: jest.fn(),
      emit: jest.fn(),
    };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("Renders TrainList and MapDetail components when selectedTrain is falsy", async () => {
  fetchMock.mockResponseOnce(JSON.stringify(sampleTrains));

  localStorage.setItem("token", "placeholder-token");

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App
        fetchData={mockFetchData}
        handleTrainClick={mockHandleTrainClick}
        handleReturnClick={mockHandleReturnClick}
      />
    </MockedProvider>
  );

  await screen.findByTestId("train-list");

  const trainList = screen.getByTestId("train-list");
  expect(trainList).toBeInTheDocument();

  const mapDetail = screen.getByTestId("map-detail");
  expect(mapDetail).toBeInTheDocument();

  expect(screen.queryByTestId("train-detail")).toBeNull();
  expect(screen.queryByTestId("tickets")).toBeNull();
});
