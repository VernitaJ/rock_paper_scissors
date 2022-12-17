import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config();
import {
  getGame,
  startGame,
  joinGame,
  makeMove,
} from "./controllers/dbFunctions.js";

var conString = process.env.DATABASE_URL;
const app = express();
const port = process.env.PORT || 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

app.get("/api/games/:id", async function (req, res, next) {
  try {
    res.json({ data: await getGame(req.params.id) });
  } catch (err) {
    console.error(`Error while getting games: `, err.message);
    next(err);
  }
});

// endpoint for joining a game
app.post("/api/games/:id/join", async function (req, res, next) {
  try {
    res.json({ message: await joinGame(req.params.id, req.body.name) });
  } catch (err) {
    console.error(`Error while trying to join game: `, err.message);
    next(err);
  }
});

// endpoint for making a move in the game
app.post("/api/games/:id/move", async function (req, res, next) {
  try {
    const newMove = { name: req.body.name, move: req.body.move };
    res.json({ message: await makeMove(req.params.id, newMove)});
  } catch (err) {
    console.error(
      `Error while trying to make a move: ${err.message}. Try again when the issue is resolved.`
    );
    next(err);
  }
});

// endpoint for starting a game
app.post("/api/games", async function (req, res, next) {
  try {
    res.json({
      data: await startGame(req.body.name),
    });
  } catch (err) {
    console.error(`Error while trying to create a game: `, err.message);
    next(err);
  }
});

// endpoint for information on how to play the game
app.get("/api/help", async function (req, res, next) {
  try {
    res.json({
      Step1:
        "One player initiates the game through sending json object {'name': '--name'} using '/api/games' and receives a game ID.",
      Step2: "Send the ID to the person you want to play against.",
      Step3:
        "Player 2 joins by sending a json object {'name': '--name'} using '/api/games/:id/join'.",
      Step4:
        "After Player 2 joins, both of you can send your move (rock, paper, or scissors) using your name as an identifier.",
      Step5:
        "When both players have submitted their moves, find the results using endpoint '/api/games/:id'!",
    });
  } catch (err) {
    console.error(`Error at ${Date.now()}`, err.message);
    next(err);
  }
});

app.use((req, res) =>
  res.status(404).send({
    error: "This endpoint doesn't exist!",
  })
);

app.use((err, req, res, next) => {
  res.status(500).send({
    error:
      "Invalid Request! Please Check that you are entering the right thing!",
  });
});

var client = new pg.Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error("could not connect to database", err);
  }
  client.query(
    "CREATE TABLE IF NOT EXISTS Games (id uuid DEFAULT uuid_generate_v4 (), player1 VARCHAR NOT NULL, player2 VARCHAR, player1_move VARCHAR, player2_move VARCHAR, created_at timestamp DEFAULT current_timestamp)",
    function (err) {
      if (err) {
        return console.error("error running query", err);
      }
    }
  );
  app.listen(port, () => {
    console.log(
      `Database connection established. \nDecision-Time open on port ${port}`
    );
  });
});

export { app, client };

// POST /api/games
// POST /api/games/{id}/join
// POST /api/games/{id}/move
// GET /api/games/{id}
// GET /api/help
