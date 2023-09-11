import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const MapDetail = () => {
  const [trainData, setTrainData] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:1337'); // Connect to your Node.js server on port 1337

    socket.on('connect', () => {
      console.log('Connected to server via socket.');
    });

    socket.on('message', (trainObject) => {
      // Update the state with the received train data
      setTrainData((prevTrainData) => [...prevTrainData, trainObject]);
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Train Data</h1>
      <ul>
        {trainData.map((train, index) => (
          <li key={index}>
            Train Number: {train.trainnumber}, Position: {train.position}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapDetail;
