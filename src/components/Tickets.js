import React, { useEffect, useState } from 'react';

const Tickets = ({selectedTrain}) => {
  const [codes, setCodes] = useState([])
  const [selectedCode, setSelectedCode] = useState(null);
  const [allTickets, setAllTickets] = useState([])

  useEffect(() => {
    fetch('http://localhost:1337/codes')
      .then((response) => response.json())
      .then((data) => setCodes(data.data));
    
    fetch('http://localhost:1337/tickets')
      .then((response) => response.json())
      .then((data) => setAllTickets(data.data));
    }, []);

  const handleSelectChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedCode(codes[selectedIndex]);
  };

  const handleSubmit = () => {
    if (selectedCode) {
      let newTicket = {
            code: selectedCode.Code,
            trainnumber: selectedTrain.OperationalTrainNumber,
            traindate: selectedTrain.EstimatedTimeAtLocation.substring(0, 10),
          };

      fetch('http://localhost:1337/tickets', {
        body: JSON.stringify(newTicket),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      })
        .then((response) => response.json())
        .then((result) => {
            setAllTickets([result.data, ...allTickets]) //update the state variable alltickets with the new ticket
        })
        .catch((error) => {
          console.error('Error adding ticket:', error.message);
        });
    }
  }

  return (
    <div className='ticketContainer'>
      <div>
          <p>Orsakskod:</p>
          <select className='form-select form-select-sm' onChange={handleSelectChange}>
          <option value="">Välj en kod...</option>
          {codes.map((code, index) => (
            <option key={index} value={index}>
              {code.Code} - {code.Level3Description}
            </option>
          ))}
        </select>
        <button className='btn btn-success newTicketBtn' onClick={handleSubmit}>Skapa nytt ärende</button>
      </div>
      <hr />
      <div>
        <h3>Befintliga ärenden</h3>
        {allTickets.map((ticket, index) => (
          <p key={index}>{ticket.code} - {ticket.trainnumber} - {ticket.traindate}</p>
        )
        )}
      </div>
    </div>
  )
}

export default Tickets;
