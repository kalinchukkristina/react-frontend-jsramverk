import React from 'react';

function TrainDetail({ selectedTrain, onReturnClick, outputDelay }) {

  return (
    <div className='ticketContainer'>
      <button type='button' className='btn btn-outline-secondary' onClick={() => onReturnClick()}>Tillbaka</button>
      <h3>Nytt ärende</h3>
      {selectedTrain && (
        <div>
          <p>Tåg från <strong>{selectedTrain.FromLocation ? selectedTrain.FromLocation[0].LocationName : <i>No data</i>}</strong> till <strong>{selectedTrain.ToLocation ? selectedTrain.ToLocation[0].LocationName : <i>No data</i>}</strong>. Just nu i <strong>{selectedTrain.LocationSignature ? selectedTrain.LocationSignature : <i>No data</i>}</strong>.</p>
          <p><strong>Försenad:</strong> {outputDelay(selectedTrain)}</p>
        </div>
      )}
    </div>
  );
}

export default TrainDetail;