
const DETERMINISTIC_ROUNDS = new Set([3, 5, 6, 7]);

export const isDeterministic = (round) => {
  return DETERMINISTIC_ROUNDS.has(round);
};

export const getAllUsedOpponents = (opponents, round3OpponentR5Match, firstRound3OpponentR5Match) => {
  const usedOpponents = new Set();
  const { player1, player8 } = opponents;

  for (let round = 1; round <= 7; round++) {
    if (player1[round]) usedOpponents.add(player1[round]);
    if (player8[round]) usedOpponents.add(player8[round]);
  }


  if (round3OpponentR5Match) usedOpponents.add(round3OpponentR5Match);
  if (firstRound3OpponentR5Match) usedOpponents.add(firstRound3OpponentR5Match);

  return usedOpponents;
};

export const getRound3Opponent = (opponents) => opponents.player1[3];

export const getFirstRound3Opponent = (opponents) => opponents.player8[3]; 