import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { GET_CODES } from "./../queries";
import { GET_TICKETS } from "./../queries";
import { CREATE_TICKET } from "./../queries";

const Tickets = ({ selectedTrain }) => {
  const {
    loading: loadingQueryOne,
    error: errorQueryOne,
    data: codes,
  } = useQuery(GET_CODES);
  let {
    loading: loadingQueryTwo,
    error: errorQueryTwo,
    data: allTickets,
  } = useQuery(GET_TICKETS);
  const [selectedCode, setSelectedCode] = useState(null);
  const [createTicket] = useMutation(CREATE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS }],
  });

  const handleSelectChange = (event) => {
    //callback function for selecting a reason code
    const selectedIndex = event.target.value;
    setSelectedCode(codes.codes[selectedIndex]);
  };

  const handleSubmit = async () => {
    //callback function for button 'Skapa nytt ärende'
    if (selectedCode) {
      try {
        await createTicket({
          variables: {
            ticketInput: {
              code: selectedCode.Code,
              trainnumber: selectedTrain.OperationalTrainNumber,
              traindate: selectedTrain.EstimatedTimeAtLocation,
            },
          },
        });
      } catch (mutationError) {
        console.error("Mutation error:", mutationError);
      }
    }
  };

  if (loadingQueryOne || loadingQueryTwo) {
    return <p>Loading...</p>;
  }

  if (errorQueryOne || errorQueryTwo) {
    return <p>Error: Something went wrong.</p>;
  }

  if (!codes || !allTickets) {
    return <p>No data available</p>;
  }

  return (
    <div className="ticketContainer">
      <div>
        <p>Orsakskod:</p>
        <select
          className="form-select form-select-sm"
          onChange={handleSelectChange}
        >
          <option value="">Välj en kod...</option>
          {codes.codes.map((code, index) => (
            <option key={index} value={index}>
              {code.Code} - {code.Level3Description}
            </option>
          ))}
        </select>
        <button className="btn btn-success newTicketBtn" onClick={handleSubmit}>
          Skapa nytt ärende
        </button>
      </div>
      <hr />
      <div>
        <h3>Befintliga ärenden</h3>
        {allTickets.tickets.map((ticket, index) => (
          <p key={index}>
            {ticket.code} - {ticket.trainnumber} -{" "}
            {ticket.traindate.substring(0, 10)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
