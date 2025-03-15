import React, { useState, useEffect, useCallback } from "react";
import CosmicBackground from "./components/CosmicBackground";
import GradientTitle from "./components/GradientTitle";
import { translations } from "./translations/languages";

import howTo1 from "./howTo/1.png";
import howTo2 from "./howTo/2.png";
import howTo3 from "./howTo/3.png";
import howTo4 from "./howTo/4.png";
import howTo5 from "./howTo/5.png";
import howTo6 from "./howTo/6.png";
import howTo7 from "./howTo/7.png";
import howTo8 from "./howTo/8.png";
import howTo9 from "./howTo/9.png";
import howTo10 from "./howTo/10.png";
import howTo11 from "./howTo/11.png";

const Predictor = () => {
  const [language, setLanguage] = useState("id");
  const t = translations[language];

  const [currentRound] = useState(7);
  const [opponents, setOpponents] = useState({
    player1: Array(20).fill(null),
    player8: Array(20).fill(null),
  });

  const [firstOpponentId, setFirstOpponentId] = useState(8);

  const [playerNames, setPlayerNames] = useState({
    0: "cancel",
    1: "You",
    2: "Player 2",
    3: "Player 3",
    4: "Player 4",
    5: "Player 5",
    6: "Player 6",
    7: "Player 7",
    8: "Player 8",
  });

  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState("");

  const [round3OpponentR5Match, setRound3OpponentR5Match] = useState(null);

  const [firstRound3OpponentR5Match, setFirstRound3OpponentR5Match] =
    useState(null);

  const resetMatchData = () => {
    setOpponents({
      player1: Array(20).fill(null),
      player8: Array(20).fill(null),
    });
    setRound3OpponentR5Match(null);
    setFirstRound3OpponentR5Match(null);
  };

  const updatePredictions = useCallback(() => {
    const newOpponents = {
      player1: [...opponents.player1],
      player8: [...opponents.player8],
    };

    for (let round = 1; round <= currentRound; round++) {
      if (round === 3) {
        if (opponents.player8[2]) {
          newOpponents.player1[3] = opponents.player8[2];
        }

        if (opponents.player1[2]) {
          newOpponents.player8[3] = opponents.player1[2];
        }
      } else if (round === 5 && opponents.player8[4]) {
        newOpponents.player1[5] = opponents.player8[4];

        if (opponents.player1[4]) {
          newOpponents.player8[5] = opponents.player1[4];
        }
      } else if (round === 6) {
        const round3Opponent = opponents.player1[3];

        if (round3Opponent) {
          if (round3OpponentR5Match) {
            newOpponents.player1[6] = round3OpponentR5Match;
          } else {
            // Try to find it automatically from our recorded matchups
            const opponentsInRound5 = {};

            // Collect all known Round 5 matchups
            Object.entries(opponents).forEach(([player, opponentList]) => {
              const playerNum = player === "player1" ? 1 : 8;
              if (opponentList[5]) {
                opponentsInRound5[playerNum] = opponentList[5];
                opponentsInRound5[opponentList[5]] = playerNum;
              }
            });

            // Try to find the opponent of your round 3 opponent in round 5
            if (opponentsInRound5[round3Opponent]) {
              newOpponents.player1[6] = opponentsInRound5[round3Opponent];
            }
          }
        }

        const firstRound3Opponent = opponents.player8[3];

        if (firstRound3Opponent) {
          if (firstRound3OpponentR5Match) {
            newOpponents.player8[6] = firstRound3OpponentR5Match;
          } else {
            const opponentsInRound5 = {};

            Object.entries(opponents).forEach(([player, opponentList]) => {
              const playerNum = player === "player1" ? 1 : 8;
              if (opponentList[5]) {
                opponentsInRound5[playerNum] = opponentList[5];
                opponentsInRound5[opponentList[5]] = playerNum;
              }
            });

            if (opponentsInRound5[firstRound3Opponent]) {
              newOpponents.player8[6] = opponentsInRound5[firstRound3Opponent];
            }
          }
        }
      } else if (round === 7) {
        if (opponents.player8[6]) {
          newOpponents.player1[7] = opponents.player8[6];
        }

        if (opponents.player1[6]) {
          newOpponents.player8[7] = opponents.player1[6];
        }
      }
    }

    if (JSON.stringify(opponents) !== JSON.stringify(newOpponents)) {
      setOpponents(newOpponents);
    }
  }, [
    opponents,
    currentRound,
    round3OpponentR5Match,
    firstRound3OpponentR5Match,
  ]);

  useEffect(() => {
    updatePredictions();
  }, [updatePredictions]);

  const handleOpponentChange = (player, round, value) => {
    if (value === "0") {
      setOpponents((prev) => {
        const newOpponents = { ...prev };
        newOpponents[player][round] = null;

        if (round === 2) {
          newOpponents[player][3] = null;

          if (player === "player1") {
            newOpponents.player8[3] = null;
          } else if (player === "player8") {
            newOpponents.player1[3] = null;
          }
        } else if (round === 4) {
          newOpponents[player][5] = null;

          if (player === "player1") {
            newOpponents.player8[5] = null;
          } else if (player === "player8") {
            newOpponents.player1[5] = null;
          }
        } else if (round === 3 || round === 5) {
          newOpponents[player][6] = null;
        } else if (round === 6) {
          newOpponents[player][7] = null;

          if (player === "player1") {
            newOpponents.player8[7] = null;
          } else if (player === "player8") {
            newOpponents.player1[7] = null;
          }
        }

        return newOpponents;
      });
      return;
    }

    const newValue = value === "" ? "" : parseInt(value);
    setOpponents((prev) => {
      const newOpponents = { ...prev };

      newOpponents[player][round] = newValue === "" ? null : newValue;
      return newOpponents;
    });
  };

  const startEditName = (playerId) => {
    setEditingName(playerId);
    setTempName(playerNames[playerId]);
  };

  const savePlayerName = (playerId) => {
    if (tempName.trim() === "") {
      setPlayerNames((prev) => ({
        ...prev,
        [playerId]: playerId === 1 ? "You" : `Player ${playerId}`, // Default names
      }));
    } else {
      setPlayerNames((prev) => ({
        ...prev,
        [playerId]: tempName,
      }));
    }
    setEditingName(null);
  };

  const handleNameChange = (newName) => {
    setTempName(newName);
  };

  const handleNameKeyDown = (e, currentId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      savePlayerName(currentId);
      // Move to next player when Enter is pressed
      if (currentId < 8) {
        startEditName(currentId + 1);
      }
    }
  };

  const isDeterministic = (round) => {
    return round === 3 || round === 5 || round === 6 || round === 7;
  };

  const getOpponentOptions = (playerNumber) => {
    const usedOpponents = getAllUsedOpponents(playerNumber);

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
    const usedOpponents = getAllUsedOpponents(playerNumber);

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

  // Get current round 3 opponent (for Round 6 prediction)
  const getRound3Opponent = () => {
    return opponents.player1[3];
  };

  // Get First's round 3 opponent (for Round 6 prediction)
  const getFirstRound3Opponent = () => {
    return opponents.player8[3];
  };

  // Handle First Opponent change
  const handleFirstOpponentChange = (playerId) => {
    const id = parseInt(playerId);
    if (id !== 1 && id >= 2 && id <= 8) {
      setFirstOpponentId(id);

      // Reset match data when changing the First Opponent
      resetMatchData();
    }
  };

  // Function to display opponent with player names
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
          getRound3Opponent() &&
          !round3OpponentR5Match) ||
        (round === 6 &&
          playerNum === 8 &&
          getFirstRound3Opponent() &&
          !firstRound3OpponentR5Match)
      ) {
        return (
          <span className="font-medium text-indigo-400">{t.needInput}</span>
        );
      }

      // Handle special cases based on round
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

  const SelectedPlayer = ({ playerId, className = "" }) => {
    if (!playerId) return null;
    return (
      <div
        className={`px-3 py-2 mb-2 text-sm font-medium text-white bg-indigo-600/50 rounded-lg border border-indigo-500/30 ${className}`}
      >
        <span>{playerNames[playerId]}</span>
      </div>
    );
  };

  // Update fungsi untuk mendapatkan semua opponent yang sudah dipilih
  const getAllUsedOpponents = (playerNumber) => {
    const usedOpponents = new Set();

    for (let round = 1; round <= 7; round++) {
      if (opponents.player1[round]) {
        usedOpponents.add(opponents.player1[round]);
      }
      if (opponents.player8[round]) {
        usedOpponents.add(opponents.player8[round]);
      }
    }

    if (round3OpponentR5Match) {
      usedOpponents.add(round3OpponentR5Match);
    }
    if (firstRound3OpponentR5Match) {
      usedOpponents.add(firstRound3OpponentR5Match);
    }

    return usedOpponents;
  };

  const [currentHowToImage, setCurrentHowToImage] = useState(1);
  const totalHowToImages = 11;

  const howToImages = [
    howTo1,
    howTo2,
    howTo3,
    howTo4,
    howTo5,
    howTo6,
    howTo7,
    howTo8,
    howTo9,
    howTo10,
    howTo11,
  ];

  const slideDescriptions = [
    "Perhatikan Lawan Pertama anda.",
    "Pilih player lawan pertama anda pada menu dropdown.",
    "Perhatikan lawan kedua anda, dan lawan kedua dari lawan pertama sebelumnya",
    "Input pada Round 2.",
    "Lawan berikutnya akan diisi secara otomatis di tabel.",
    "Perhatikan kembali lawan anda, dan lawan dari lawan pertama sebelumnya.",
    "Input kedua nya pada Round 4.",
    "Lawan berikutnya akan diisi secara otomatis di tabel.",
    "Perhatikan lawan anda di Round 3, dan lawan dari lawan pertama sebelumnya.",
    "input pada Round 6, di kedua Card *note: jangan sampai terbalik, perhatikan nama nya.",
    "Hasil prediksi selesai, *note: prediksi akan berubah ketika ada satu atau dua player yang TERELIMINASI.",
  ];

  // Function to navigate between how-to images
  const changeHowToImage = (direction) => {
    if (direction === "next") {
      setCurrentHowToImage((prev) =>
        prev === totalHowToImages ? 1 : prev + 1
      );
    } else {
      setCurrentHowToImage((prev) =>
        prev === 1 ? totalHowToImages : prev - 1
      );
    }
  };

  // Add state for how-to visibility
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="relative min-h-screen py-4 overflow-hidden text-white bg-black">
      <CosmicBackground />
      <GradientTitle />

      {/* Language Selector */}
      <div className="absolute z-20 top-4 right-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-2 py-1 text-sm text-white transition-colors border rounded shadow-lg bg-gray-800/80 backdrop-blur-sm border-violet-500/50 hover:border-violet-400"
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
        </select>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Players Card */}
          <div className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-violet-500/30 hover:shadow-violet-500/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{t.players}</h2>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-indigo-200">
                  {t.firstOpponent}
                </label>
                <select
                  value={firstOpponentId}
                  onChange={(e) => handleFirstOpponentChange(e.target.value)}
                  className="px-2 py-1 text-xs font-medium text-white transition-colors border rounded shadow-md bg-gray-800/90 border-violet-500/50 hover:border-violet-400"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((id) => (
                    <option key={id} value={id}>
                      {playerNames[id]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {/* You (P1) card */}
              <div className="p-2 transition-all duration-300 border rounded-lg shadow-lg bg-gradient-to-br from-violet-900/80 to-indigo-900/80 border-violet-500/50 hover:border-violet-400 hover:shadow-violet-500/20">
                <div className="flex items-center">
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-violet-300">
                      You
                    </span>
                    <div
                      className="text-base font-medium text-white cursor-pointer"
                      onClick={() => !editingName && startEditName(1)}
                    >
                      {editingName === 1 ? (
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full p-1 text-base font-medium text-white border rounded outline-none bg-gray-700/90 border-violet-500/50 focus:border-violet-400"
                          autoFocus
                          onBlur={() => savePlayerName(1)}
                          onKeyDown={(e) => handleNameKeyDown(e, 1)}
                        />
                      ) : (
                        playerNames[1]
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other players */}
              {[2, 3, 4, 5, 6, 7, 8].map((id) => (
                <div
                  key={id}
                  className={`p-2 transition-all duration-300 rounded-lg border shadow-lg ${
                    id === firstOpponentId
                      ? "bg-gradient-to-br from-violet-900/80 to-indigo-900/80 border-violet-500/50 hover:border-violet-400 hover:shadow-violet-500/20"
                      : "bg-gray-800/90 border-gray-600/50 hover:border-gray-500 hover:shadow-indigo-500/10"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      {id === firstOpponentId && (
                        <span className="text-xs font-semibold text-violet-300">
                          {t.firstOpponent}
                        </span>
                      )}
                      <div
                        className={`text-base font-medium cursor-pointer ${
                          id === firstOpponentId
                            ? "text-indigo-200"
                            : "text-gray-300"
                        }`}
                        onClick={() => !editingName && startEditName(id)}
                      >
                        {editingName === id ? (
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className={`w-full p-1 text-base font-medium text-white border rounded outline-none ${
                              id === firstOpponentId
                                ? "bg-gray-700/90 border-violet-500/50 focus:border-violet-400"
                                : "bg-gray-700 border-gray-600 focus:border-gray-500"
                            }`}
                            autoFocus
                            onBlur={() => savePlayerName(id)}
                            onKeyDown={(e) => handleNameKeyDown(e, id)}
                          />
                        ) : (
                          playerNames[id]
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add this hint text below player cards */}
              <div className="mt-2 text-center">
                <p className="text-xs italic text-gray-400">
                  {language === "id"
                    ? "Klik nama untuk mengganti"
                    : "Click name to change"}
                  <span className="ml-1 text-violet-400">•</span>
                  <span className="ml-1 text-gray-400">
                    {language === "id"
                      ? "Enter untuk lanjut"
                      : "Enter to continue"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Update other cards similarly */}
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
                      <SelectedPlayer playerId={opponents.player1[round]} />
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
                      <SelectedPlayer playerId={opponents.player8[round]} />
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

            {/* Round 6 Helpers - Two separate cards in a row */}
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
                    <SelectedPlayer playerId={round3OpponentR5Match} />
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
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value)
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
                    <SelectedPlayer playerId={firstRound3OpponentR5Match} />
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
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value)
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

            {/* Hidden component for Round 1 direct match */}
            <div className="hidden">
              {useEffect(() => {
                // Set direct match for Round 1
                handleOpponentChange("player1", 1, firstOpponentId);
                handleOpponentChange("player8", 1, 1);
              }, [firstOpponentId])}
            </div>

            {/* Predictions */}
            <div className="mt-4 overflow-hidden border rounded-lg shadow-lg bg-gray-900/95 border-violet-500/30">
              <div className="px-4 py-2 bg-gradient-to-r from-violet-900/80 via-indigo-900/80 to-purple-900/80">
                <h2 className="text-lg font-bold text-white">
                  {t.predictions}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-800/90">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300"
                      >
                        {t.round}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300"
                      >
                        {t.yourOpponent}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300"
                      >
                        {playerNames[firstOpponentId] + t.opponentOf}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-xs font-medium tracking-wider text-left text-indigo-300"
                      >
                        {t.notes}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {Array.from({ length: currentRound }, (_, i) => i + 1).map(
                      (round) => (
                        <tr
                          key={round}
                          className={`${
                            isDeterministic(round)
                              ? "bg-violet-900/20"
                              : "bg-gray-900/80"
                          } hover:bg-gray-800/90 transition-colors`}
                        >
                          <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
                            {round}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
                            {getOpponentDisplay("player1", round)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-200 whitespace-nowrap">
                            {getOpponentDisplay("player8", round)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-200">
                            {round === 1 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.random}
                              </span>
                            )}
                            {round === 2 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.random}
                              </span>
                            )}
                            {round === 3 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.swapR2}
                              </span>
                            )}
                            {round === 4 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.random}
                              </span>
                            )}
                            {round === 5 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.swapR4}
                              </span>
                            )}
                            {round === 6 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.r3R5}
                              </span>
                            )}
                            {round === 7 && (
                              <span className="font-medium text-violet-300">
                                {t.noteTexts.swapR6}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex w-full lg:col-span-3">
            <button
              onClick={() => setShowHowTo(!showHowTo)}
              className="px-2 py-1 text-sm font-medium text-white transition-all duration-300 border animate-gradient-slow border-violet-500/50 hover:border-violet-400 font-inter"
              style={{
                backgroundImage: `linear-gradient(45deg, 
                  #4f46e5 0%,
                  #7c3aed 20%,
                  #2563eb 40%,
                  #4338ca 60%,
                  #8b5cf6 80%,
                  #4f46e5 100%
                )`,
                backgroundSize: "200% 200%",
                textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                borderRadius: "5px",
                marginTop: "-10px",
                marginBottom: "-10px",
                outline: "none",
                fontSize: "0.7rem",
              }}
            >
              {showHowTo ? "tutup" : "cara pakai"}
            </button>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden lg:col-span-3 ${
              showHowTo ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 transition-all border rounded-lg shadow-xl bg-gray-900/80 backdrop-blur-md border-violet-500/30 hover:shadow-violet-500/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                  {t.howTo.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-indigo-300">
                    {currentHowToImage} / {totalHowToImages}
                  </span>
                </div>
              </div>

              <div className="relative">
                {/* Previous button */}
                <button
                  onClick={() => changeHowToImage("prev")}
                  className="absolute z-10 p-2 transition-all transform -translate-y-1/2 bg-black rounded-full opacity-70 left-2 top-1/2 hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="overflow-hidden rounded-lg">
                  <div className="relative aspect-[16/9] md:aspect-[21/9]">
                    <img
                      src={howToImages[currentHowToImage - 1]}
                      alt={`How to step ${currentHowToImage}`}
                      className="object-contain w-full h-full rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="p-3 text-center md:p-4 bg-gray-800/90">
                    <h3 className="mb-2 text-base font-semibold text-indigo-300 md:text-lg">
                      {t.howTo.title} - {t.step} {currentHowToImage}
                    </h3>
                    <p className="text-xs text-gray-300 md:text-sm">
                      {slideDescriptions[currentHowToImage - 1]}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => changeHowToImage("next")}
                  className="absolute z-10 p-2 transition-all transform -translate-y-1/2 bg-black rounded-full opacity-70 right-2 top-1/2 hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center mt-4 space-x-1 md:space-x-2">
                {Array.from({ length: totalHowToImages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentHowToImage(i + 1)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                      currentHowToImage === i + 1
                        ? "bg-violet-500"
                        : "bg-gray-600 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Footer */}
      <footer className="relative z-10 py-4 mt-8 border-t border-violet-500/20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="https://wa.me/+6281382885716"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 space-x-2 transition-colors rounded-md bg-gray-800/50 hover:bg-gray-700/50 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-green-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white">
                WhatsApp
              </span>
            </a>

            <a
              href="https://tiktok.com/@mutaks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 space-x-2 transition-colors rounded-md bg-gray-800/50 hover:bg-gray-700/50 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white">
                TikTok
              </span>
            </a>

            <a
              href="https://github.com/rzki-lil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 space-x-2 transition-colors rounded-md bg-gray-800/50 hover:bg-gray-700/50 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white">
                GitHub
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Predictor;
