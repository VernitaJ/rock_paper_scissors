## Overview

A simple rock-paper-scissors game implentation purely using HTTP requests.

</br>
The available endpoints are:

### */api/games*
This endpoint is used to create a new game. It takes a JSON object with the following fields: `name`. It returns a confirmation that the game has been created, with a game ID to be shared with the 2nd player.
### */api/games/:id*
This endpoint is used to view the current state of a game. It returns a JSON object with the following fields: `player1`, `player2`, `created_at`, and `results`
### */api/games/:id/join*
This endpoint is used to join a game. It takes a JSON object with the following fields: `name`. Both players have to be registered in the game before any moves can be registered.
### */api/games/:id/move*
This endpoint is used to make a move. It takes a JSON object with the following fields: `name` and `move`. If both players have played, a JSON object with the results of the game will be returned.
### */api/help*
This endpoint is used to view the rules for play and the available endpoints.

</br>

## Database

The application uses a SQL database hosted at Elephantsql. The details for this database is stored in the environment variables, and upon starting the application, the database connection is established. The table is created automatically in the database if it does not exist.

</br>

## Running the HTTP application

The application is written for Node. To run this application, you will need to have Node installed. You can download it from [here](https://nodejs.org/en/download/). Once you have Node installed, you can run the application by running the following commands:

    npm install
    npm start

This starts the server on port 3000. You can change the port by setting the `PORT` environment variable.

Once the server is running, you can access the endpoints by making HTTP requests to `http://localhost:3000/api/...`

</br>

## Testing instructions

To test the application, you can use Postman. Simply import the collection from the local file: `RPS_API.postman_collection.json` into your Postman environment. This will create a collection with all the endpoints and sample requests. Body data is included in the collection, but can be modified to test different scenarios.

Alternatively, the following instructions can be used to run the API using curl.

Open a terminal to emulate two players. Run the following commands:
1. Create a new game by making a POST request to `/api/games` with a JSON object containing the name of the first player. The response will contain the ID of the game.
        
        curl -v http://localhost:3000/api/games -d '{"name": "Player 1"}'

2. Join the game by making a POST request to `/api/games/:id/join` with a JSON object containing the name of the second player.
    
        curl -v http://localhost:3000/api/games/:id/join -d '{"name": "Player 2"}'

3. Make a move by making a POST request to `/api/games/:id/move` with a JSON object containing the name of the player and the move they want to make. Note, this can only be done once both players have joined the game.

        curl -v http://localhost:3000/api/games/:id/move -d '{"name": "Player 1", "move": "rock"}'

4. Make a move by making a POST request to `/api/games/:id/move` with a JSON object containing the name of the player and the move they want to make. Note, this can only be done once both players have joined the game.
    
            curl -v http://localhost:3000/api/games/:id/move -d '{"name": "Player 2", "move": "paper"}'

5. View the results of the game by making a GET request to `/api/games/:id`. The response will contain the results of the game.
    
            curl -v http://localhost:3000/api/games/:id


## Notes

More models could be created, but it seemed unnecessary for the scope of this implementation. The database host, Elephantsql, was selected for convenience, and for simple deletion as the credentials would be shared.
