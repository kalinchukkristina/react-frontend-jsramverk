import React from "react";

const TrainList = ({ trains, onTrainClick, outputDelay }) => {
  return (
    <div data-testid="train-list" className="delayedTrainsList">
      <h1>Försenade tåg</h1>
      {trains.data ? (
        <table className="table table-striped table-fixed">
          <tbody>
            {trains.data.map((train, index) => (
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrainList;
