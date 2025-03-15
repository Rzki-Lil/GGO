import React, { useMemo } from "react";
import PredictionsTable from "./PredictionsTable";
import {
  isDeterministic,
  getAllUsedOpponents,
  getRound3Opponent,
  getFirstRound3Opponent,
} from "../utils/gameUtils";

const SelectedPlayer = React.memo(
  ({ playerId, playerNames, className = "" }) => {
    if (!playerId) return null;
    return (
      <div
        className={`px-3 py-2 mb-2 text-sm font-medium text-white bg-indigo-600/50 rounded-lg border border-indigo-500/30 ${className}`}
      >
        <span>{playerNames[playerId]}</span>
      </div>
    );
  }
);

const MatchInputs = ({
  opponents,
  setOpponents,
  playerNames,
  firstOpponentId,
  currentRound,
  t,
  round3OpponentR5Match,
  setRound3OpponentR5Match,
  firstRound3OpponentR5Match,
  setFirstRound3OpponentR5Match,
  handleOpponentChange,
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
        <option value="">{t.select}</option>
        <option key={0} value={0} className="bg-red-800">
          {playerNames[0]}
        </option>
        {[1, 2, 3, 4, 5, 6, 7, 8]
          .filter((i) => i !== playerNumber && !usedOpponents.has(i))
          .map((i) => (
            <option key={i} value={i} className="bg-gray-700">
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
        <option value="">{t.select}</option>
        <option value="0" className="bg-red-800">
          {playerNames[0]}
        </option>
        {[2, 3, 4, 5, 6, 7, 8].map((id) => {
          if (id !== playerNumber && !usedOpponents.has(id)) {
            return (
              <option key={id} value={id} className="bg-gray-700">
                {playerNames[id]}
              </option>
            );
          }
          return null;
        })}
      </>
    );
  };

  const getOpponentDisplay = (player, round) => {
    const playerNum = player === "player1" ? 1 : 8;
    const opponent = opponents[player][round];

    if (opponent) {
      return (
        <span className="font-medium text-indigo-300">
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
          <span className="font-medium text-indigo-400">{t.needInput}</span>
        );
      }

      if (
        (round === 3 && !opponents.player8[2] && player === "player1") ||
        (round === 3 && !opponents.player1[2] && player === "player8") ||
        (round === 5 && !opponents.player8[4] && player === "player1") ||
        (round === 5 && !opponents.player1[4] && player === "player8")
      ) {
        return <span className="font-medium text-indigo-400">{t.waiting}</span>;
      }

      return <span className="font-medium text-indigo-400">{t.predict}</span>;
    }

    return <span className="text-gray-400">{t.notSet}</span>;
  };

  return (
    <div className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-violet-500/30 hover:shadow-violet-500/10 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{t.matchInputs}</h2>
        <button
          onClick={resetMatchData}
          className="px-3 py-1 text-xs font-medium text-white transition-colors rounded-md shadow-md bg-red-700/90 hover:bg-red-600"
        >
          {t.resetMatches}
        </button>
      </div>

      {/* Non-deterministic rounds input */}
      <div className="flex flex-wrap gap-4">
        {/* Direct match in Round 1 */}
        <div className="w-full p-3 mb-1 text-center transition-all duration-300 border rounded-lg shadow-lg bg-violet-900/40 border-violet-500/40">
          <p className="text-sm font-medium text-indigo-100">
            {t.directMatchText}{" "}
            <span className="font-bold text-violet-300">
              {playerNames[firstOpponentId]}
            </span>
          </p>
        </div>

        {/* Rounds 2 and 4 inputs */}
        {[2, 4].map((round) => (
          <div
            key={`input-r${round}`}
            className="flex-1 min-w-[180px] p-3 bg-gray-800/90 border border-violet-500/30 rounded-lg shadow-lg hover:border-violet-500/50 transition-all"
          >
            <h3 className="mb-3 text-base font-bold text-white">
              Round {round}
            </h3>

            <div className="space-y-3">
              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-indigo-200">
                  {t.yourOpponent}
                </label>
                <SelectedPlayer
                  playerId={opponents.player1[round]}
                  playerNames={playerNames}
                />
                <select
                  value={opponents.player1[round] || ""}
                  onChange={(e) =>
                    handleOpponentChange("player1", round, e.target.value)
                  }
                  className="block w-full px-3 py-2 text-sm text-white transition-colors border rounded-lg outline-none bg-gray-700/90 border-violet-500/40 hover:border-violet-500 focus:border-violet-400"
                >
                  {getR24OpponentOptions(1, round)}
                </select>
              </div>

              <div className="group">
                <label className="block mb-1 text-sm font-semibold text-indigo-200">
                  {playerNames[firstOpponentId]}'s {t.opponent}
                </label>
                <SelectedPlayer
                  playerId={opponents.player8[round]}
                  playerNames={playerNames}
                />
                <select
                  value={opponents.player8[round] || ""}
                  onChange={(e) =>
                    handleOpponentChange("player8", round, e.target.value)
                  }
                  className="block w-full px-3 py-2 text-sm text-white transition-colors border rounded-lg outline-none bg-gray-700/90 border-violet-500/40 hover:border-violet-500 focus:border-violet-400"
                >
                  {getR24OpponentOptions(firstOpponentId, round)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Round 6 Helpers */}
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        {/* Your R6 Helper */}
        {opponents.player1[3] && (
          <div className="p-3 overflow-hidden transition-all border rounded-lg shadow-lg bg-gray-800/90 border-violet-500/30 animate-fadeIn hover:border-violet-500/50">
            <h3 className="mb-2 text-sm font-bold text-violet-300">
              {t.r6Helper.you}
            </h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-200">
                {t.r6Helper.yourR3}{" "}
                <strong className="text-violet-200">
                  {playerNames[opponents.player1[3]]}
                </strong>
                {t.r6Helper.r5Match}
              </div>
              <SelectedPlayer
                playerId={round3OpponentR5Match}
                playerNames={playerNames}
              />
              <select
                value={round3OpponentR5Match || ""}
                onChange={(e) => {
                  if (e.target.value === "0") {
                    setRound3OpponentR5Match(null);
                    setOpponents((prev) => {
                      const newOpponents = { ...prev };
                      newOpponents.player1[6] = null;
                      newOpponents.player1[7] = null;
                      newOpponents.player8[7] = null;
                      return newOpponents;
                    });
                  } else {
                    setRound3OpponentR5Match(
                      e.target.value === "" ? null : parseInt(e.target.value)
                    );
                  }
                }}
                className="block w-full px-3 py-2 text-sm text-white transition-colors border rounded-lg outline-none bg-gray-700/90 border-violet-500/40 hover:border-violet-500 focus:border-violet-400"
              >
                {getOpponentOptions(opponents.player1[3])}
              </select>
            </div>
          </div>
        )}

        {/* First's R6 Helper */}
        {opponents.player8[3] && (
          <div className="p-3 overflow-hidden transition-all border rounded-lg shadow-lg bg-gray-800/90 border-violet-500/30 animate-fadeIn hover:border-violet-500/50">
            <h3 className="mb-2 text-sm font-bold text-violet-300">
              {playerNames[firstOpponentId]}'s {t.r6Helper.first}
            </h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-200">
                {t.r6Helper.theirR3}{" "}
                <strong className="text-violet-200">
                  {playerNames[opponents.player8[3]]}
                </strong>
                {t.r6Helper.r5Match}
              </div>
              <SelectedPlayer
                playerId={firstRound3OpponentR5Match}
                playerNames={playerNames}
              />
              <select
                value={firstRound3OpponentR5Match || ""}
                onChange={(e) => {
                  if (e.target.value === "0") {
                    setFirstRound3OpponentR5Match(null);
                    setOpponents((prev) => {
                      const newOpponents = { ...prev };
                      newOpponents.player8[6] = null;
                      newOpponents.player1[7] = null;
                      newOpponents.player8[7] = null;
                      return newOpponents;
                    });
                  } else {
                    setFirstRound3OpponentR5Match(
                      e.target.value === "" ? null : parseInt(e.target.value)
                    );
                  }
                }}
                className="block w-full px-3 py-2 text-sm text-white transition-colors border rounded-lg outline-none bg-gray-700/90 border-violet-500/40 hover:border-violet-500 focus:border-violet-400"
              >
                {getOpponentOptions(opponents.player8[3])}
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
        t={t}
        getOpponentDisplay={getOpponentDisplay}
      />
    </div>
  );
};

export default React.memo(MatchInputs);
