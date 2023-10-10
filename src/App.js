import React, { useState } from "react";
import TrainList from "./components/TrainList";
import TrainDetail from "./components/TrainDetail";
import MapDetail from "./components/MapDetail";
import Tickets from "./components/Tickets";
import LoginRegister from './components/LoginRegister';
import { useQuery } from "@apollo/client";
import { GET_DELAYED_TRAINS } from "./queries";

function App() {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const { loading, error, data } = useQuery(GET_DELAYED_TRAINS);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="App">
      {selectedTrain ? (
        <>
          <TrainDetail
            selectedTrain={selectedTrain}
            onReturnClick={handleReturnClick}
            outputDelay={outputDelay}
          />
          <Tickets selectedTrain={selectedTrain}></Tickets>
        </>
      ) : (
        <>
          <TrainList
            trains={data.delayed}
            onTrainClick={handleTrainClick}
            outputDelay={outputDelay}
          />
          <MapDetail />
        </>
      )}
      <LoginRegister />
    </div>
  );
}

export default App;
