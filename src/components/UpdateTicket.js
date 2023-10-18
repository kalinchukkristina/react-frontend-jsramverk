import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TICKET } from "./../queries";
import { format } from "date-fns";

function UpdateTickets({ ticket, codes, setUpdateModalOpen }) {
  const [selectedCode, setSelectedCode] = useState(ticket.code);
  const [trainNumber, setTrainNumber] = useState(ticket.trainnumber);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(ticket.traindate), "yyyy-MM-dd")
  );

  const [updateTicket] = useMutation(UPDATE_TICKET);

  const handleUpdate = async () => {
    // Construct the updated ticket data
    const updatedTicket = {
      code: selectedCode,
      trainnumber: trainNumber,
      traindate: selectedDate,
    };

    try {
      await updateTicket({
        variables: {
          ticketId: ticket._id,
          ticketInput: updatedTicket,
        },
      });

      setUpdateModalOpen(false);
    } catch (mutationError) {
      console.error("Mutation error:", mutationError);
    }
  };

  return (
    <div>
      <div>
        <h3>Update Ticket</h3>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="form-select form-select-sm input"
        >
          {codes.map((code) => (
            <option key={code.Code} value={code.Code}>
              {code.Code} - {code.Level3Description}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value)}
          className="form-control input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="form-control input"
        />
        <button onClick={handleUpdate} className="btn btn-success update">
          Update Ticket
        </button>
        <button
          onClick={() => setUpdateModalOpen(false)}
          className="btn btn-danger"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default UpdateTickets;
