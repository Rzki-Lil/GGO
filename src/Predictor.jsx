import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { translations } from "./translations/languages";
import {
  getAllUsedOpponents,
  getRound3Opponent,
  getFirstRound3Opponent,
} from "./utils/gameUtils";

// Lazy load components with prefetch
const CosmicBackground = React.lazy(() =>
  import("./components/CosmicBackground")
);
const GradientTitle = React.lazy(() => import("./components/GradientTitle"));
const HowToGuide = React.lazy(() => import("./components/HowToGuide"));
const PlayersList = React.lazy(() => import("./components/PlayersList"));
const MatchInputs = React.lazy(() => import("./components/MatchInputs"));

const Footer = React.lazy(() => import("./components/Footer"));

const howToImages = Array.from({ length: 11 }, (_, i) => {
  const img = new Image();
  img.src = require(`./howTo/${i + 1}.png`);
  return img.src;
});

const Predictor = () => {
  const [language, setLanguage] = useState("id");
  const t = useMemo(() => translations[language], [language]);

  const [currentRound] = useState(7);
  const [opponents, setOpponents] = useState({
    player1: Array(20).fill(null),
    player8: Array(20).fill(null),
  });

  const [firstOpponentId, setFirstOpponentId] = useState(8);
  const [showHowTo, setShowHowTo] = useState(false);
  const [currentHowToImage, setCurrentHowToImage] = useState(1);

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
        ? "You"
        : `Player ${playerId}`,
    }));
    setEditingName(null);
  }, []);

  const handleNameKeyDown = useCallback(
    (e, currentId) => {
      if (e.key === "Enter") {
        e.preventDefault();
        savePlayerName(currentId, e.target.value);
        // Skip player 1 (You) when cycling through players with Enter key
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

            // Auto-determine firstRound3OpponentR5Match if only one player remains
            if (firstRound3Opponent && !firstRound3OpponentR5Match) {
              const usedOpponents = getAllUsedOpponents(
                opponents,
                round3OpponentR5Match,
                null
              );

              // Find all valid opponent options (1-8 except used ones and firstRound3Opponent)
              const validOptions = [1, 2, 3, 4, 5, 6, 7, 8].filter(
                (id) => id !== firstRound3Opponent && !usedOpponents.has(id)
              );

              // If only one valid option remains, automatically set it
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
      t,
      playerNames,
      firstOpponentId,
      opponents,
      currentRound,
    }),
    [t, playerNames, firstOpponentId, opponents, currentRound]
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

  const howToProps = useMemo(
    () => ({
      language,
      showHowTo,
      setShowHowTo,
      currentImage: howToImages[currentHowToImage - 1],
      currentHowToImage,
      setCurrentHowToImage,
      totalImages: howToImages.length,
    }),
    [language, showHowTo, currentHowToImage]
  );

  return (
    <div className="relative min-h-screen py-4 overflow-hidden text-white bg-black">
      <Suspense fallback={null}>
        <CosmicBackground />
        <GradientTitle />
      </Suspense>

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
          <Suspense
            fallback={
              <div className="p-4 text-center animate-pulse">Loading...</div>
            }
          >
            <PlayersList {...playersListProps} />
            <MatchInputs {...matchInputsProps} />
          </Suspense>

          <div className="flex w-full lg:col-span-3">
            <button
              onClick={() => setShowHowTo(!showHowTo)}
              className="px-2 py-1 text-sm font-medium text-white transition-transform duration-200 ease-out border hover:scale-105 border-violet-500/50 hover:border-violet-400 font-inter"
              style={{
                background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
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

          <Suspense
            fallback={
              <div className="p-4 text-center animate-pulse">
                Loading guide...
              </div>
            }
          >
            {showHowTo && <HowToGuide {...howToProps} />}
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
