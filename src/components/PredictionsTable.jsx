import React, { memo } from "react";
import { isDeterministic } from "../utils/gameUtils";

const TableRow = memo(({ round, player1Display, player8Display, noteText }) => (
  <tr
    className={`${
      isDeterministic(round) ? "bg-violet-900/20" : "bg-gray-900/80"
    } hover:bg-gray-800/90 transition-colors`}
  >
    <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
      {round}
    </td>
    <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
      {player1Display}
    </td>
    <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
      {player8Display}
    </td>
    <td className="px-3 py-2 text-sm text-gray-200">{noteText}</td>
  </tr>
));

const PredictionsTable = memo(
  ({
    currentRound,
    opponents,
    playerNames,
    firstOpponentId,
    t,
    getOpponentDisplay,
  }) => {
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
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300">
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
                    player1Display={getOpponentDisplay("player1", round)}
                    player8Display={getOpponentDisplay("player8", round)}
                    noteText={getNoteText(round)}
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
