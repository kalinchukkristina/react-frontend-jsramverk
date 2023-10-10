import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapDetail = ({ trains }) => {
  const [trainData, setTrainData] = useState({});

  useEffect(() => {
    const socket = io(`http://localhost:1337`);

    socket.on("connect", () => {
      console.log("Connected to server via socket.");
    });

    // Event handler for when a 'message' event is received from the server
    socket.on("message", (trainObject) => {
      const trainMatch = trains.find(
        (train) => train.OperationalTrainNumber === trainObject.trainnumber
      );

      if (trainMatch) {
        setTrainData((prevTrainData) => {
          const updatedTrainData = { ...prevTrainData };
          updatedTrainData[trainObject.trainnumber] = trainObject;
          return updatedTrainData;
        });
      }
    });

    // Cleanup function: Disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [trains]); // Empty dependency array means this effect runs once

  // Extract an array of train markers from the trainData state
  const trainMarkers = Object.values(trainData);

  return (
    <div data-testid="map-detail" className="map-container">
      {/* Create a MapContainer to render the Leaflet map */}
      <MapContainer
        center={[62.173276, 14.942265]} // Initial map center coordinates
        zoom={5} // Initial zoom level
        style={{ height: "1000px", width: "100%" }}
      >
        {/* Add a base TileLayer for the map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map over trainMarkers to create Marker and Popup components */}
        {trainMarkers.map((train, index) => (
          <Marker key={index} position={train.position}>
            <Popup>Train Number: {train.trainnumber}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDetail;
