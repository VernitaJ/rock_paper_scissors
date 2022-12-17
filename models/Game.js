export default class GameDetail {
    constructor(id, name) {
    this.welcome = `Rock-Paper-Scissors game initiated by ${name}! Go ahead and send the gameID below to your colleague so they can join the game.`;
    this.gameID = id;
    this.description = 'After player2 joins, you can send your move (rock, paper, or scissors). When both players have submitted their moves, look for the results!';
    }
}