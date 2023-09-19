import React from "react";
import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import io from "socket.io-client";
import App from "./App";

const mockFetchData = jest.fn(() => Promise.resolve(sampleTrains));
const mockHandleTrainClick = jest.fn();
const mockHandleReturnClick = jest.fn();

const sampleTrains = {
  data: [
    {
      OperationalTrainNumber: "1403",
      LocationSignature: "Karl",
      FromLocation: [{ LocationName: "A" }],
      ToLocation: [{ LocationName: "B" }],
    },
  ],
};

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

  render(
    <App
      fetchData={mockFetchData}
      handleTrainClick={mockHandleTrainClick}
      handleReturnClick={mockHandleReturnClick}
    />
  );

  await screen.findByTestId("train-list");

  const trainList = screen.getByTestId("train-list");
  expect(trainList).toBeInTheDocument();

  const mapDetail = screen.getByTestId("map-detail");
  expect(mapDetail).toBeInTheDocument();

  expect(screen.queryByTestId("train-detail")).toBeNull();
  expect(screen.queryByTestId("tickets")).toBeNull();
});
