const getWinner = (player1, player2, pl1_move, pl2_move) => {
  const pl1 = pl1_move == 'rock' ? 0 : pl1_move == 'paper' ? 1 : 2;
  const pl2 = pl2_move == 'rock' ? 0 : pl2_move == 'paper' ? 1 : 2;
  const result = (pl1 % 3 - pl2 % 3 + 3) % 3;
  return result == 0 ? "Tied!" : result == 1 ? `${player1}` : `${player2}`;
};


const moveValid = (move, player2) => {
  if (player2 === null) {
    return "Waiting for player 2 to join";
  } else if (!(move === "rock" || move === "paper" || move === "scissors")) {
    return "Invalid move. Please choose rock, paper, or scissors";
  };
  return null;
};

const getPlayer = (player1, player2, currentPlayer) => {
  return player1 === currentPlayer
      ? "player1"
      : player2 === currentPlayer
      ? "player2"
      : null;
}

export { getWinner, moveValid, getPlayer };
