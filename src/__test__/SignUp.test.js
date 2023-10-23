import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./../App";
import { MockedProvider } from "@apollo/client/testing";
import { GET_DELAYED_TRAINS } from "../queries";
import { LOGIN_USER } from "../queries";
import { GET_USER } from "../queries";

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
  {
    request: {
      query: LOGIN_USER,
      variables: {
        loginInput: {
          username: "test",
          password: "test",
        },
      },
    },
    result: {
      data: {
        loginUser: {
          message: "Login successful",
          token: "test123",
          username: "test123",
        },
      },
    },
  },
  {
    request: {
      query: GET_USER,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        tickets: [
          {
            _id: "123123",
            code: "123",
            trainnumber: "1403",
            traindate: "2023-09-17",
          },
          {
            _id: "123124",
            code: "456",
            trainnumber: "1404",
            traindate: "2023-09-18",
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

test("it should display the sign up form if the user clicks on the 'Sign up' link", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await waitFor(() => {
    const signUpButton = screen.getByTestId("signUp-link");
    expect(signUpButton).toBeInTheDocument();
  });

  const signUpButton = screen.getByTestId("signUp-link");
  fireEvent.click(signUpButton);

  await waitFor(() => {
    expect(screen.getByTestId("register-btn")).toBeInTheDocument();
  });
});
