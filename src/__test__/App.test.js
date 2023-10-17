import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./../App";
import { MockedProvider } from "@apollo/client/testing";
import { GET_DELAYED_TRAINS } from "../queries";

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

jest.mock("./../components/MapDetail", () => {
  return {
    __esModule: true,
    default: function MapDetailMock() {
      return <div data-testid="map-detail">Mock MapDetail</div>;
    },
  };
});

const originalLocalStorage = { ...global.localStorage };

beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn((key) => {
      if (key === "token") {
        return "your-token-value";
      }
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

afterEach(() => {
  global.localStorage = originalLocalStorage;
});

test("it App component", async () => {
  global.localStorage.setItem("token", "your-token-value");
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await waitFor(() => {
    const welcomeHeader = screen.getByTestId("welcome");
    expect(welcomeHeader).toBeInTheDocument();
  });

  await waitFor(() => {
    const trainListComp = screen.getByTestId("train-list");
    expect(trainListComp).toBeInTheDocument();
  });

  await waitFor(() => {
    const mapDetailComp = screen.getByTestId("map-detail");
    expect(mapDetailComp).toBeInTheDocument();
  });
});
