export default class GameDetail {
    constructor(name1, name2, date) {
        this.player1 = name1;
        this.player2 = name2;
        this.dateStarted = new Date(date).toString().substring(0, 24);
        this.results = "";
    }
}