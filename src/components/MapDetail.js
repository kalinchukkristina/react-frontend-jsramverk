import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapDetail = () => {
  const [trainData, setTrainData] = useState({});

  useEffect(() => {
    const socket = io('http://localhost:1337'); // Connect to your Node.js server on port 1337

    socket.on('connect', () => {
      console.log('Connected to server via socket.');
    });

    socket.on('message', (trainObject) => {
      // Update the state with the received train data
      setTrainData((prevTrainData) => {
        const updatedTrainData = { ...prevTrainData };
        updatedTrainData[trainObject.trainnumber] = trainObject;
        return updatedTrainData;
      });
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  const trainMarkers = Object.values(trainData);

  return (
    <div className="map-container">
      <MapContainer
        center={[62.173276, 14.942265]} // Initial map center coordinates
        zoom={5} // Initial zoom level
        style={{ height: '1000px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {trainMarkers.map((train, index) => (
          <Marker
            key={index}
            position={train.position} // Use your train data's position array
          >
            <Popup>
              Train Number: {train.trainnumber}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDetail;
