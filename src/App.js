import React, { useState, useEffect } from 'react';
import TrainList from './components/TrainList';
import TrainDetail from './components/TrainDetail';
import MapDetail from './components/MapDetail';
import Tickets from './components/Tickets';

function App() {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    fetch('http://localhost:1337/delayed')
      .then((response) => response.json())
      .then((data) => setTrains(data));
  }, []);

  const handleTrainClick = (train) => {
    setSelectedTrain(train);
  };

  const handleReturnClick = () => {
    setSelectedTrain(null)
  }

  const outputDelay = (item) => {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
}

  return (
    <div className="App">
      {selectedTrain ? (
        <>
          <TrainDetail selectedTrain={selectedTrain} onReturnClick={handleReturnClick} outputDelay={outputDelay}/>
          <Tickets selectedTrain={selectedTrain}></Tickets>
        </>
      ) : (
        <TrainList trains={trains} onTrainClick={handleTrainClick} outputDelay={outputDelay} />
      )}
      <MapDetail />
    </div>
  );
}

export default App;

