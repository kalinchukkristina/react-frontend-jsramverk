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

const originalLocalStorage = { ...global.localStorage };

beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

afterEach(() => {
  global.localStorage = originalLocalStorage;
});

test("it should display the login form when no token is in localStorage", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await waitFor(() => {
    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
  });

  await waitFor(() => {
    const loginName = screen.getByTestId("login-name");
    expect(loginName).toBeInTheDocument();
  });

  await waitFor(() => {
    const loginPwd = screen.getByTestId("login-pwd");
    expect(loginPwd).toBeInTheDocument();
  });
});
