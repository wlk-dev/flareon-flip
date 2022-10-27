const Board = require("./Board")

class GameState {
    constructor() {
        this.totalCoins = 0;
        this.coins = 0;
        this.board = this._genBoard();
        this.highMults = this.board.getHighMults();
        this.level = 1;

        this.tilesFlipped = 0;
        this.highTilesFlipped = 0;
        // TODO: Add level up conditions
    }

    _flippedTile(high) {
        this.tilesFlipped++;
        if (high) this.highTilesFlipped++;
    }

    _resetGameData() {
        this.board = this._genBoard();
        this.highMults = this.board.getHighMults();

        this.tilesFlipped = 0;
        this.highTilesFlipped = 0;
        this.coins = 0;
    }

    _genBoard() {
        return new Board();
    }

    _newBoardWin(level) {
        this.totalCoins += this.coins;
        this.level = level;

        this._resetGameData();
    }

    _newBoardLoss(level) {
        this.level = level;

        this._resetGameData();
    }

    _checkForDemotion(flippedBomb) {
        if (flippedBomb) {
            return { demote : true, toLevel : this.tilesFlipped < 2 ? 1 : this.level-1 };
        }

        return {demote : false, toLevel : this.level};
    }

    _checkForWin() {
        this.highTilesFlipped == this.highMults ? true : false;
    }

    _parseTile(eventObj) {
        const {isBomb, coinValue} = eventObj.detail.tileObj;
        const {demote, toLevel} =  this._checkForDemotion( isBomb );

        coinValue > 1 ? this._flippedTile(true) : this._flippedTile(false); // if its a high multiple tile pass true else false

        if(demote) {
            this._newBoardLoss(toLevel);
        } else {
            this.coins > 0 ? this.coins *= coinValue : this.coins += coinValue;
            this._newBoardWin( this.level += 1 )
        }
    }

    listen() {
        addEventListener("turnedTile", this._parseTile);
    }

}

module.exports = GameState;