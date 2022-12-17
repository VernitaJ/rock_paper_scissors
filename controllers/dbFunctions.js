import { client } from "../server.js";
import { getWinner, moveValid, getPlayer } from "./helpers.js";
import GameDetail from "../models/GameDetail.js";
import Game from "../models/Game.js";

// Function to get game details
async function getGame(id) {
  let game = await client.query(`SELECT * FROM Games WHERE id = '${id}'`);
  game = game.rows[0];
  const { player1, player2, player1_move, player2_move, created_at, winner } =
    game;

  // Create a new GameDetail object
  const gameDetail = new GameDetail(player1, player2, created_at);

  gameDetail.results =
    player2 === null
      ? "Waiting for player 2."
      : player1_move === null
      ? player2_move === null
        ? "No moves submitted from either player."
        : `Waiting for ${game.player1} to make a move`
      : player2_move === null
      ? `Waiting for ${game.player2} to make a move`
      : `The winner is ${winner}`;

  return gameDetail;
}

// Function to create a game
async function startGame(name) {
  if (name == null || name == undefined)
    return "Please enter a name to start the game";

  const game = await client.query(
    `INSERT INTO Games (player1) VALUES ('${name}') RETURNING id;`
  );

  const gameId = game.rows[0].id;
  const newGame = new Game(gameId, name);
  return newGame;
}

// Function to join a game
async function joinGame(id, name) {
  let game = await client.query(`SELECT * FROM Games WHERE id = '${id}'`);
  game = game.rows[0];
  const { player2 } = game;

  // Update player2 column in Games table IF there is not already a player2 registered for this game
  return player2 === null
    ? await client
        .query(
          `UPDATE Games SET player2='${name}' WHERE id='${id}' AND player2 IS NULL;`
        )
        .then(() => `${name} has joined the game`)
    : "There are already two players in this game";
}

// Function to register a move for the specified player
async function makeMove(id, newMove) {
  let game = await client.query(`SELECT * FROM Games WHERE id = '${id}'`); // Get game details in order to do some checks
  const { player1, player2, player1_move, player2_move } = game.rows[0];

  const current_player = getPlayer(player1, player2, newMove.name); // Check if player is a player in this game
  if (current_player === null) return "You are not a player in this game"; // If player is not a player in this game, return message

  const moveQuery = `UPDATE Games SET ${current_player}_move = '${newMove.move}' WHERE id = '${id}';`;

  const validMove = moveValid(newMove.move, player2); // Check if move is valid
  if (validMove != null) return validMove; // If move is invalid, return message

  if (
    (current_player === "player1" && player1_move != null) || // If player has already made a move, return message
    (current_player === "player2" && player2_move != null)
  ) {
    return "Sneaky... But you've already made a move";
  }

  // Function to find prev or current move for specified player
  const getPlayerMove = (player) => {
    return current_player === player
      ? newMove.move
      : game.rows[0][`${player}_move`];
  };

  if (
    (player1_move != null && current_player === "player2") ||
    (player2_move != null && current_player === "player1")
  ) {
    // If both players have made a move, update winner column
    const winner = getWinner(
      player1,
      player2,
      getPlayerMove("player1"),
      getPlayerMove("player2")
    );
    
    return await client
      .query(`UPDATE Games SET ${current_player}_move = '${newMove.move}', winner = '${winner}' WHERE id = '${id}';`)
      .then(
        () =>
          `Your move has been registered, ${newMove.name}. The winner is... ${winner}!`
      );
  }

  // If player hasn't made a move, add move to specified player
  return await client
    .query(moveQuery)
    .then(
      () =>
        `Your move has been registered, ${newMove.name}. Waiting for the other player to make their move...`
    );
}

export { getGame, startGame, joinGame, makeMove };
