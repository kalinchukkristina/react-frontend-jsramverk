import React, { useState } from "react";
import TrainList from "./components/TrainList";
import TrainDetail from "./components/TrainDetail";
import MapDetail from "./components/MapDetail";
import Tickets from "./components/Tickets";
import LoginRegister from "./components/LoginRegister";
import { useQuery } from "@apollo/client";
import { GET_DELAYED_TRAINS } from "./queries";

function App() {
  const [filteredArray, setFilteredArray] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  let { loading, error, data } = useQuery(GET_DELAYED_TRAINS);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  ); // Check if token exists in local storage

  const handleTrainClick = (train) => {
    setSelectedTrain(train);
  };

  const handleReturnClick = () => {
    setSelectedTrain(null);
  };

  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleMarkerClick = (clickedTrain, _) => {
    setFilteredArray(
      data.delayed.filter(
        (train) => train.OperationalTrainNumber === clickedTrain.trainnumber
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      {isAuthenticated && (
        <>
          {selectedTrain ? (
            <>
              <TrainDetail
                selectedTrain={selectedTrain}
                onReturnClick={handleReturnClick}
                outputDelay={outputDelay}
              />
              <Tickets selectedTrain={selectedTrain} />
              <MapDetail
                trains={[selectedTrain]}
                onMarkerClick={handleMarkerClick}
                setFilteredArray={setFilteredArray}
              />
            </>
          ) : (
            <>
              <TrainList
                trains={filteredArray ? filteredArray : data.delayed}
                onTrainClick={handleTrainClick}
                outputDelay={outputDelay}
              />
              <MapDetail
                trains={data.delayed}
                onMarkerClick={handleMarkerClick}
              />
            </>
          )}
        </>
      )}
      {!isAuthenticated && (
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
