import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import {
  getAllUsedOpponents,
  getRound3Opponent,
  getFirstRound3Opponent,
} from "./utils/gameUtils";

import PlayersList from "./components/PlayersList";

const CosmicBackground = React.lazy(() =>
  import("./components/CosmicBackground")
);
const GradientTitle = React.lazy(() => import("./components/GradientTitle"));
const MatchInputs = React.lazy(() => import("./components/MatchInputs"));
const Footer = React.lazy(() => import("./components/Footer"));

const Predictor = () => {
  const [currentRound] = useState(7);
  const [opponents, setOpponents] = useState({
    player1: Array(20).fill(null),
    player8: Array(20).fill(null),
  });

  const [firstOpponentId, setFirstOpponentId] = useState(8);

  const [playerNames, setPlayerNames] = useState({
    0: "batal",
    1: "Kamu",
    2: "Pemain 2",
    3: "Pemain 3",
    4: "Pemain 4",
    5: "Pemain 5",
    6: "Pemain 6",
    7: "Pemain 7",
    8: "Pemain 8",
  });

  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState("");

  const [round3OpponentR5Match, setRound3OpponentR5Match] = useState(null);
  const [firstRound3OpponentR5Match, setFirstRound3OpponentR5Match] =
    useState(null);

  const resetMatchData = useCallback(() => {
    setOpponents({
      player1: Array(20).fill(null),
      player8: Array(20).fill(null),
    });
    setRound3OpponentR5Match(null);
    setFirstRound3OpponentR5Match(null);
  }, []);

  const handleOpponentChange = useCallback((player, round, value) => {
    if (value === "0") {
      setOpponents((prev) => {
        const newOpponents = { ...prev };
        newOpponents[player][round] = null;

        if (round === 2) {
          newOpponents[player][3] = null;
          newOpponents[player === "player1" ? "player8" : "player1"][3] = null;
        } else if (round === 4) {
          newOpponents[player][5] = null;
          newOpponents[player === "player1" ? "player8" : "player1"][5] = null;
        } else if (round === 3 || round === 5) {
          newOpponents[player][6] = null;
        } else if (round === 6) {
          newOpponents[player][7] = null;
          newOpponents[player === "player1" ? "player8" : "player1"][7] = null;
        }

        return newOpponents;
      });
      return;
    }

    setOpponents((prev) => {
      const newOpponents = { ...prev };
      newOpponents[player][round] = value === "" ? null : parseInt(value);
      return newOpponents;
    });
  }, []);

  const handleFirstOpponentChange = useCallback(
    (playerId) => {
      const id = parseInt(playerId);
      if (id !== 1 && id >= 2 && id <= 8) {
        setFirstOpponentId(id);
        resetMatchData();
      }
    },
    [resetMatchData]
  );

  const startEditName = useCallback((playerId) => {
    setEditingName(playerId);
    setTempName("");
  }, []);

  const savePlayerName = useCallback((playerId, value) => {
    setPlayerNames((prev) => ({
      ...prev,
      [playerId]: value?.trim()
        ? value
        : playerId === 1
        ? "Kamu"
        : `Pemain ${playerId}`,
    }));
    setEditingName(null);
  }, []);

  const handleNameKeyDown = useCallback(
    (e, currentId) => {
      if (e.key === "Enter") {
        e.preventDefault();
        savePlayerName(currentId, e.target.value);
        if (currentId < 8) {
          const nextId = currentId + 1;
          startEditName(nextId === 1 ? 2 : nextId);
        }
      }
    },
    [savePlayerName, startEditName]
  );

  useEffect(() => {
    const updatePredictions = () => {
      const newOpponents = {
        player1: [...opponents.player1],
        player8: [...opponents.player8],
      };

      for (let round = 1; round <= currentRound; round++) {
        if (round === 3) {
          if (opponents.player8[2])
            newOpponents.player1[3] = opponents.player8[2];
          if (opponents.player1[2])
            newOpponents.player8[3] = opponents.player1[2];
        } else if (round === 5 && opponents.player8[4]) {
          newOpponents.player1[5] = opponents.player8[4];
          if (opponents.player1[4])
            newOpponents.player8[5] = opponents.player1[4];
        } else if (round === 6) {
          const round3Opponent = getRound3Opponent(opponents);
          const firstRound3Opponent = getFirstRound3Opponent(opponents);

          if (round3Opponent && round3OpponentR5Match) {
            newOpponents.player1[6] = round3OpponentR5Match;

            if (firstRound3Opponent && !firstRound3OpponentR5Match) {
              const usedOpponents = getAllUsedOpponents(
                opponents,
                round3OpponentR5Match,
                null
              );

              const validOptions = [1, 2, 3, 4, 5, 6, 7, 8].filter(
                (id) => id !== firstRound3Opponent && !usedOpponents.has(id)
              );

              if (validOptions.length === 1) {
                newOpponents.player8[6] = validOptions[0];
                setFirstRound3OpponentR5Match(validOptions[0]);
              }
            }
          }

          if (firstRound3Opponent && firstRound3OpponentR5Match) {
            newOpponents.player8[6] = firstRound3OpponentR5Match;
          }
        } else if (round === 7) {
          if (opponents.player8[6])
            newOpponents.player1[7] = opponents.player8[6];
          if (opponents.player1[6])
            newOpponents.player8[7] = opponents.player1[6];
        }
      }

      if (JSON.stringify(opponents) !== JSON.stringify(newOpponents)) {
        setOpponents(newOpponents);
      }
    };

    updatePredictions();
  }, [
    opponents,
    currentRound,
    round3OpponentR5Match,
    firstRound3OpponentR5Match,
    setFirstRound3OpponentR5Match,
  ]);

  useEffect(() => {
    handleOpponentChange("player1", 1, firstOpponentId);
    handleOpponentChange("player8", 1, 1);
  }, [firstOpponentId, handleOpponentChange]);

  const commonProps = useMemo(
    () => ({
      playerNames,
      firstOpponentId,
      opponents,
      currentRound,
    }),
    [playerNames, firstOpponentId, opponents, currentRound]
  );

  const playersListProps = useMemo(
    () => ({
      ...commonProps,
      handleFirstOpponentChange,
      editingName,
      startEditName,
      savePlayerName,
      handleNameKeyDown,
      setTempName,
    }),
    [
      commonProps,
      handleFirstOpponentChange,
      editingName,
      startEditName,
      savePlayerName,
      handleNameKeyDown,
    ]
  );

  const matchInputsProps = useMemo(
    () => ({
      ...commonProps,
      setOpponents,
      round3OpponentR5Match,
      setRound3OpponentR5Match,
      firstRound3OpponentR5Match,
      setFirstRound3OpponentR5Match,
      handleOpponentChange,
      handleFirstOpponentChange,
      resetMatchData,
    }),
    [
      commonProps,
      setOpponents,
      round3OpponentR5Match,
      setRound3OpponentR5Match,
      firstRound3OpponentR5Match,
      setFirstRound3OpponentR5Match,
      handleOpponentChange,
      handleFirstOpponentChange,
      resetMatchData,
    ]
  );

  return (
    <div className="relative min-h-screen py-4 overflow-hidden text-white bg-black">
      <Suspense fallback={null}>
        <CosmicBackground />
        <GradientTitle />
      </Suspense>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Suspense
            fallback={
              <div className="p-4 text-center animate-pulse">Loading...</div>
            }
          >
            <PlayersList {...playersListProps} />
            <MatchInputs {...matchInputsProps} />
          </Suspense>

        </div>
      </div>

      <Suspense
        fallback={<div className="py-4 animate-pulse">Loading footer...</div>}
      >
        <Footer />
      </Suspense>
    </div>
  );
};

export default React.memo(Predictor);
