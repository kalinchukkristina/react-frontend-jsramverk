import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { GET_CODES } from "./../queries";
import { CREATE_TICKET } from "./../queries";
import { GET_USER } from "./../queries";
import UpdateTicket from "./UpdateTicket";

const Tickets = ({ selectedTrain, userTickets, userId }) => {
  let {
    loading: loadingQueryOne,
    error: errorQueryOne,
    data: codes,
  } = useQuery(GET_CODES);
  const [selectedCode, setSelectedCode] = useState(null);
  const [createTicket] = useMutation(CREATE_TICKET);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSelectChange = (event) => {
    //callback function for selecting a reason code

    const selectedIndex = event.target.value;
    setSelectedCode(codes.codes[selectedIndex]);
  };

  const handleSubmit = async () => {
    //callback function for button 'Skapa nytt ärende'

    if (selectedCode) {
      const newTicket = {
        code: selectedCode.Code,
        trainnumber: selectedTrain.OperationalTrainNumber,
        traindate: selectedTrain.EstimatedTimeAtLocation,
      };

      try {
        await createTicket({
          variables: {
            ticketInput: newTicket,
            userId: userId,
          },
          refetchQueries: [{ query: GET_USER, variables: { id: userId } }],
        });
      } catch (mutationError) {
        console.error("Mutation error:", mutationError);
      }
    }
  };

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateModalOpen(true);
  };

  if (loadingQueryOne) {
    return <p>Loading...</p>;
  }

  if (errorQueryOne) {
    console.log("1", errorQueryOne);
    return <p></p>;
  }

  if (!codes || !userTickets) {
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
        {isUpdateModalOpen ? (
          <UpdateTicket
            ticket={selectedTicket}
            codes={codes.codes}
            setUpdateModalOpen={setUpdateModalOpen}
          />
        ) : (
          <div>
            <h3>Befintliga ärenden</h3>
            {[...userTickets.user.tickets].reverse().map((ticket, index) => (
              <div key={index}>
                <p onClick={() => openUpdateModal(ticket)}>
                  {ticket.code} - {ticket.trainnumber} -{" "}
                  {ticket.traindate.substring(0, 10)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
