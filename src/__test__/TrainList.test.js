import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TrainList from "./../components/TrainList";

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

const mockOnTrainClick = jest.fn();
const mockOutputDelay = jest.fn();

test("TrainList component displays a table with data", async () => {
  render(
    <TrainList
      trains={sampleTrains}
      onTrainClick={mockOnTrainClick}
      outputDelay={mockOutputDelay}
    />
  );

  const header = screen.getByText("Försenade tåg");
  const table = screen.getByRole("table");
  const rows = screen.getAllByRole("row");

  expect(header).toBeInTheDocument();
  expect(table).toBeInTheDocument();
  expect(rows.length).toBe(sampleTrains.data.length);

  await waitFor(() => {
    const operationalTrainNumber = screen.getByText("1403");
    expect(operationalTrainNumber).toBeInTheDocument();
  });

  await waitFor(() => {
    const locationSignature = screen.getByText("Karl");
    expect(locationSignature).toBeInTheDocument();
  });
});
