import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function PopupCloseHandler({ onPopupClose }) {
  const map = useMap();

  React.useEffect(() => {
    map.on("popupclose", onPopupClose);

    // Cleanup
    return () => {
      map.off("popupclose", onPopupClose);
    };
  }, [map, onPopupClose]);

  return null;
}

const MapDetail = ({ trains, onMarkerClick, handlePopupClose }) => {
  const [trainData, setTrainData] = useState({});

  useEffect(() => {
    const socket = io(`http://localhost:1337`);

    socket.on("connect", () => {
      console.log("Connected to server via socket.");
    });

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

    return () => {
      socket.disconnect();
    };
  }, [trains]);

  const trainMarkers = Object.values(trainData);

  return (
    <div data-testid="map-detail" className="map-container">
      <MapContainer
        center={[62.173276, 14.942265]} // Initial map center coordinates
        zoom={5} // Initial zoom level
        style={{ height: "1000px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {trainMarkers.map((train, index) => (
          <Marker
            key={index}
            position={train.position}
            eventHandlers={{
              click: (event) => onMarkerClick(train, event),
            }}
          >
            <Popup>Train Number: {train.trainnumber}</Popup>
          </Marker>
        ))}
        <PopupCloseHandler onPopupClose={handlePopupClose} />
      </MapContainer>
    </div>
  );
};

export default MapDetail;
