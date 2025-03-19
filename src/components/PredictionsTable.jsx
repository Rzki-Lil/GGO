import React, { memo, useState } from "react";
import { isDeterministic } from "../utils/gameUtils";

const TableRow = memo(
  ({
    round,
    player1Display,
    player8Display,
    noteText,
    isSelected,
    onRowClick,
  }) => {
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
        className={`${
          isDeterministic(round) ? "bg-violet-900/20" : "bg-gray-900/80"
        } ${
          isSelected ? "bg-emerald-900 border-l-4 border-emerald-600" : ""
        } hover:bg-gray-800/90 transition-colors cursor-pointer`}
      >
        <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
          {round}
        </td>
        <td className="px-3 py-2 text-sm font-medium whitespace-nowrap">
          {modifiedPlayer1Display}
        </td>
        <td className="px-3 py-2 text-sm whitespace-nowrap">
          {modifiedPlayer8Display}
        </td>
        <td className="px-3 py-2 text-sm text-gray-200">{noteText}</td>
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
    t,
    getOpponentDisplay,
  }) => {
    const [selectedRound, setSelectedRound] = useState(null);

    const handleRowClick = (round) => {
      setSelectedRound(selectedRound === round ? null : round);
    };

    const getNoteText = (round) => {
      switch (round) {
        case 1:
        case 2:
        case 4:
          return (
            <span className="font-medium text-violet-300">
              {t.noteTexts.random}
            </span>
          );
        case 3:
          return (
            <span className="font-medium text-violet-300">
              {t.noteTexts.swapR2}
            </span>
          );
        case 5:
          return (
            <span className="font-medium text-violet-300">
              {t.noteTexts.swapR4}
            </span>
          );
        case 6:
          return (
            <span className="font-medium text-violet-300">
              {t.noteTexts.r3R5}
            </span>
          );
        case 7:
          return (
            <span className="font-medium text-violet-300">
              {t.noteTexts.swapR6}
            </span>
          );
        default:
          return null;
      }
    };

    // Custom hook to modify opponent display for player1 to use green color
    const getCustomOpponentDisplay = (player, round) => {
      const display = getOpponentDisplay(player, round);

      if (display && display.props) {
        if (player === "player1") {
          if (display.props.className.includes("text-indigo-300")) {
            // For actual player names, make them emerald
            return React.cloneElement(display, {
              className: display.props.className.replace(
                "text-indigo-300",
                "text-emerald-300"
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
      <div className="mt-4 overflow-hidden border rounded-lg shadow-lg bg-gray-900/95 border-violet-500/30">
        <div className="px-4 py-2 bg-gradient-to-r from-violet-900/80 via-indigo-900/80 to-purple-900/80">
          <h2 className="text-lg font-bold text-white">{t.predictions}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead className="bg-gray-800/90">
              <tr>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300">
                  {t.round}
                </th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-emerald-300">
                  {t.yourOpponent}
                </th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300">
                  {playerNames[firstOpponentId] + t.opponentOf}
                </th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300">
                  {t.notes}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {Array.from({ length: currentRound }, (_, i) => i + 1).map(
                (round) => (
                  <TableRow
                    key={round}
                    round={round}
                    player1Display={getCustomOpponentDisplay("player1", round)}
                    player8Display={getOpponentDisplay("player8", round)}
                    noteText={getNoteText(round)}
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
