import React from "react";
import PredictionsTable from "./PredictionsTable";
import {
  isDeterministic,
  getAllUsedOpponents,
  getRound3Opponent,
  getFirstRound3Opponent,
} from "../utils/gameUtils";

const MatchInputs = ({
  opponents,
  setOpponents,
  playerNames,
  firstOpponentId,
  currentRound,
  round3OpponentR5Match,
  setRound3OpponentR5Match,
  firstRound3OpponentR5Match,
  setFirstRound3OpponentR5Match,
  handleOpponentChange,
  handleFirstOpponentChange,
  resetMatchData,
}) => {
  const getOpponentOptions = (playerNumber) => {
    const usedOpponents = getAllUsedOpponents(
      opponents,
      round3OpponentR5Match,
      firstRound3OpponentR5Match
    );

    return (
      <>
        <option value={0} className="text-white">
          Batal
        </option>
        {[1, 2, 3, 4, 5, 6, 7, 8]
          .filter((i) => {
            if (i === playerNumber) return false;

            if (i === round3OpponentR5Match) return true;
            return !usedOpponents.has(i);
          })
          .map((i) => (
            <option key={i} value={i} className="text-gray-200">
              {playerNames[i]}
            </option>
          ))}
      </>
    );
  };

  const getR24OpponentOptions = (playerNumber, round) => {
    const usedOpponents = getAllUsedOpponents(
      opponents,
      round3OpponentR5Match,
      firstRound3OpponentR5Match
    );

    return (
      <>
        <option value={0} className="text-white">
          Batal
        </option>
        {[2, 3, 4, 5, 6, 7, 8]
          .filter((i) => {
            if (i === playerNumber || i === firstOpponentId) return false;

            const currentSelection =
              playerNumber === 1
                ? opponents.player1[round]
                : opponents.player8[round];

            if (i === currentSelection) return true;

            return !usedOpponents.has(i);
          })
          .map((i) => (
            <option key={i} value={i} className="text-gray-200">
              {playerNames[i]}
            </option>
          ))}
      </>
    );
  };

  const getOpponentDisplay = (player, round) => {
    const playerNum = player === "player1" ? 1 : 8;
    const opponent = opponents[player][round];

    if (opponent) {
      return (
        <span className="font-medium text-chess-orange-300">
          {playerNames[opponent]}
        </span>
      );
    }

    if (isDeterministic(round)) {
      if (
        (round === 6 &&
          playerNum === 1 &&
          getRound3Opponent(opponents) &&
          !round3OpponentR5Match) ||
        (round === 6 &&
          playerNum === 8 &&
          getFirstRound3Opponent(opponents) &&
          !firstRound3OpponentR5Match)
      ) {
        return (
          <span className="font-medium text-chess-orange-400">
            Menunggu input... 
          </span>
        );
      }

      if (
        (round === 3 && !opponents.player8[2] && player === "player1") ||
        (round === 3 && !opponents.player1[2] && player === "player8") ||
        (round === 5 && !opponents.player8[4] && player === "player1") ||
        (round === 5 && !opponents.player1[4] && player === "player8")
      ) {
        return (
          <span className="font-medium text-chess-orange-400">
            Menunggu input...
          </span>
        );
      }

      return (
        <span className="font-medium text-chess-orange-400">Menunggu input...</span>
      );
    }

    return <span className="text-gray-400">Belum diset</span>;
  };

  return (
    <div className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-chess-orange-500/30 hover:shadow-chess-orange-500/10 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Input Pertandingan</h2>
        <button
          onClick={resetMatchData}
          className="px-3 py-2 text-sm font-medium text-gray-100 transition-colors bg-red-600 rounded-md hover:bg-red-500"
        >
          Reset
        </button>
      </div>

      <div className="w-full p-3 mb-4 transition-all border border-gray-600 rounded-lg shadow-lg bg-gray-800/90 hover:border-chess-orange-500/50">
        <h3 className="mb-3 text-base font-bold text-white">
          Lawan Pertama Kamu:
        </h3>
        <div className="w-full">
          <select
            value={firstOpponentId}
            onChange={(e) => handleFirstOpponentChange(e.target.value)}
            className="block w-full px-3 py-2 text-sm text-white transition-colors border border-gray-600 rounded-lg outline-none bg-gray-700/90 hover:border-chess-orange-500/50 focus:border-chess-orange-400"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((id) => (
              <option key={id} value={id}>
                {playerNames[id]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Rounds 2 and 4 inputs */}
        {[2, 4].map((round) => (
          <div
            key={`input-r${round}`}
            className="flex-1 min-w-[180px] p-3 bg-gray-800/90 border border-gray-600 rounded-lg shadow-lg hover:border-chess-orange-500/50 transition-all"
          >
            <h3 className="mb-3 text-base font-bold text-white">
              Ronde {round}
            </h3>

            <div className="space-y-3">
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-chess-orange-200">
                  Lawan Kamu
                </label>
                <select
                  value={opponents.player1[round] || 0}
                  onChange={(e) =>
                    handleOpponentChange("player1", round, e.target.value)
                  }
                  className="block w-full px-3 py-2 text-sm text-white transition-colors border border-gray-600 rounded-lg outline-none bg-gray-700/90 hover:border-chess-orange-500/50 focus:border-chess-orange-400"
                >
                  {getR24OpponentOptions(1, round)}
                </select>
              </div>

              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-chess-orange-200">
                  Lawan dari {playerNames[firstOpponentId]}
                </label>
                <select
                  value={opponents.player8[round] || 0}
                  onChange={(e) =>
                    handleOpponentChange("player8", round, e.target.value)
                  }
                  className="block w-full px-3 py-2 text-sm text-white transition-colors border border-gray-600 rounded-lg outline-none bg-gray-700/90 hover:border-chess-orange-500/50 focus:border-chess-orange-400"
                >
                  {getR24OpponentOptions(firstOpponentId, round)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* Your R6 Helper */}
        {opponents.player1[3] && (
          <div className="p-3 overflow-hidden transition-all border border-gray-600 rounded-lg shadow-lg bg-gray-800/90 animate-fadeIn hover:border-chess-orange-500/50">
            <h3 className="mb-3 text-base font-bold text-white">Ronde 6 & 7</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-200">
                Lawan{" "}
                <strong className="text-chess-orange-200">
                  {playerNames[opponents.player1[3]]}
                </strong>
                {" di Ronde 5"}
              </div>
              <select
                value={round3OpponentR5Match || 0}
                onChange={(e) => {
                  if (e.target.value === "0") {
                    setRound3OpponentR5Match(null);
                    setFirstRound3OpponentR5Match(null);
                    setOpponents((prev) => {
                      const newOpponents = { ...prev };
                      newOpponents.player1[6] = null;
                      newOpponents.player8[6] = null;
                      newOpponents.player1[7] = null;
                      newOpponents.player8[7] = null;
                      return newOpponents;
                    });
                  } else {
                    const newValue = parseInt(e.target.value);
                    setRound3OpponentR5Match(newValue);

                    setOpponents((prev) => {
                      const newOpponents = { ...prev };
                      newOpponents.player1[6] = newValue;

                      const usedOpponents = getAllUsedOpponents(
                        prev,
                        newValue,
                        null
                      );

                      const availablePlayers = [2, 3, 4, 5, 6, 7, 8].filter(
                        (id) =>
                          id !== firstOpponentId &&
                          id !== newValue &&
                          !usedOpponents.has(id)
                      );

                      if (availablePlayers.length === 1) {
                        newOpponents.player8[6] = availablePlayers[0];
                        setFirstRound3OpponentR5Match(availablePlayers[0]);

                        newOpponents.player1[7] = availablePlayers[0];
                        newOpponents.player8[7] = newValue;
                      } else {
                        newOpponents.player8[6] = null;
                        newOpponents.player1[7] = null;
                        newOpponents.player8[7] = null;
                        setFirstRound3OpponentR5Match(null);
                      }

                      return newOpponents;
                    });
                  }
                }}
                className="block w-full px-3 py-2 text-sm text-white transition-colors border border-gray-600 rounded-lg outline-none bg-gray-700/90 hover:border-chess-orange-500/50 focus:border-chess-orange-400"
              >
                {getOpponentOptions(opponents.player1[3])}
              </select>
            </div>
          </div>
        )}
      </div>

      <PredictionsTable
        currentRound={currentRound}
        opponents={opponents}
        playerNames={playerNames}
        firstOpponentId={firstOpponentId}
        getOpponentDisplay={getOpponentDisplay}
      />
    </div>
  );
};

export default React.memo(MatchInputs);
