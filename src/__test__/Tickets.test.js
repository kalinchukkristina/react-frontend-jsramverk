import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tickets from "./../components/Tickets";

const sampleSelectedTrain = {
  OperationalTrainNumber: "1403",
  EstimatedTimeAtLocation: "2023-09-17T10:00:00",
};

test("Tickets component renders correctly and handles ticket creation", async () => {
  render(<Tickets selectedTrain={sampleSelectedTrain} />);

  const orsakskodSelect = screen.getByRole("combobox");
  const createTicketButton = screen.getByText("Skapa nytt ärende");

  expect(orsakskodSelect).toBeInTheDocument();
  expect(createTicketButton).toBeInTheDocument();

  // Simulate selecting an option from the dropdown
  fireEvent.change(orsakskodSelect, { target: { value: "0" } });

  // Simulate clicking the "Skapa nytt ärende" button
  fireEvent.click(createTicketButton);

  // You can add assertions here to verify the behavior after clicking the button
});
