import React, { useState } from "react";

const TrainList = ({ trains, onTrainClick, outputDelay }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredTrains = trains.filter((train) =>
    train.OperationalTrainNumber.includes(searchQuery)
  );

  return (
    <div data-testid="train-list" className="delayedTrainsList">
      <h1>Försenade tåg</h1>
      {trains ? (
        <>
          <input
            className="form-control rounded"
            type="text"
            placeholder="Sök efter tågnummer..."
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <table className="table table-striped table-fixed">
            <tbody>
              {filteredTrains.map((train, index) => (
                <tr key={index} onClick={() => onTrainClick(train)}>
                  <td>{train.OperationalTrainNumber}</td>
                  <td className="trainSignature">
                    {train.LocationSignature}{" "}
                    <div>
                      {train.FromLocation
                        ? train.FromLocation[0].LocationName + " -> "
                        : ""}{" "}
                      {train.ToLocation ? train.ToLocation[0].LocationName : ""}
                    </div>
                  </td>
                  <td>{outputDelay(train)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrainList;
