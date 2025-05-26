import React, { memo, useState } from "react";
import { isDeterministic } from "../utils/gameUtils";

const TableRow = memo(
  ({ round, player1Display, player8Display, isSelected, onRowClick }) => {
    const modifiedPlayer1Display =
      isSelected && player1Display && player1Display.props
        ? React.cloneElement(player1Display, {
            className: player1Display.props.className
              .replace("text-emerald-300", "text-white")
              .replace("text-indigo-400", "text-white"),
          })
        : player1Display;

    const modifiedPlayer8Display =
      isSelected && player8Display && player8Display.props
        ? React.cloneElement(player8Display, {
            className: player8Display.props.className
              .replace("text-indigo-300", "text-white")
              .replace("text-indigo-400", "text-white")
              .replace("text-gray-400", "text-white"),
          })
        : player8Display;

    return (
      <tr
        onClick={() => onRowClick(round)}
        className={`
          border-b border-gray-800
          ${
            isDeterministic(round) ? "bg-chess-orange-900/20" : "bg-gray-900/80"
          }
          ${
            isSelected
              ? "!bg-chess-orange-800 border-l-4 !border-l-chess-orange-500"
              : ""
          }
          hover:bg-gray-800 transition-colors cursor-pointer
        `}
      >
        <td
          className={`px-3 py-2 text-sm whitespace-nowrap ${
            isSelected ? "text-white" : "text-gray-200"
          }`}
        >
          {round}
        </td>
        <td className="px-3 py-2 text-sm font-medium whitespace-nowrap">
          {modifiedPlayer1Display}
        </td>
        <td className="px-3 py-2 text-sm whitespace-nowrap">
          {modifiedPlayer8Display}
        </td>
      </tr>
    );
  }
);

const PredictionsTable = memo(
  ({
    currentRound,
    opponents,
    playerNames,
    firstOpponentId,
    getOpponentDisplay,
  }) => {
    const [selectedRound, setSelectedRound] = useState(null);

    const handleRowClick = (round) => {
      setSelectedRound(selectedRound === round ? null : round);
    };

    const getCustomOpponentDisplay = (player, round) => {
      const display = getOpponentDisplay(player, round);

      if (display && display.props) {
        if (player === "player1") {
          if (display.props.className.includes("text-indigo-300")) {
            return React.cloneElement(display, {
              className: display.props.className.replace(
                "text-indigo-300",
                "text-chess-orange-300"
              ),
            });
          } else if (display.props.className.includes("text-indigo-400")) {
            return display;
          }
        }
      }

      return display;
    };

    return (
      <div className="mt-4 overflow-hidden border rounded-lg shadow-lg bg-gray-900/95 border-chess-orange-500/30">
        <div className="px-4 py-2 bg-gradient-to-r from-chess-orange-900/80 via-chess-orange-800/80 to-chess-orange-700/80">
          <h2 className="text-lg font-bold text-white">Prediksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-800/90">
              <tr>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-chess-orange-300">
                  Ronde
                </th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-chess-orange-300">
                  Lawan Kamu
                </th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-chess-orange-300">
                  {playerNames[firstOpponentId]}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: currentRound }, (_, i) => i + 1).map(
                (round) => (
                  <TableRow
                    key={round}
                    round={round}
                    player1Display={getCustomOpponentDisplay("player1", round)}
                    player8Display={getOpponentDisplay("player8", round)}
                    isSelected={selectedRound === round}
                    onRowClick={handleRowClick}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

export default PredictionsTable;
