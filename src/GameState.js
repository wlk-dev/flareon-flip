const Board = require("./Board")

class GameState {
    constructor() {
        this.totalCoinsCollected = 0;
        this.totalCoins = 0
        this.board = this._genBoard()
        this.level = 1;

        this.lastResult = true; // true = win

        this.losses = 0;
        this.consecutiveLosses = 0;

        // TODO: Add level up conditions
    }

    _genBoard() {
        return new Board()
    }

    _newBoardWin() {
        this.board = this._genBoard();
        this.totalCoinsCollected += this.totalCoins;
        this.totalCoins = 0;
        this.lastResult = true;
    }

    _newBoardLoss() {
        this.board = this._genBoard();
        this.totalCoins = 0;
        this.losses++;

        if (this.lastResult) {
            this.lastResult = false;
        } else {
            this.consecutiveLosses++;
        }
    }

    _checkForDemotion() {
        if(this.losses > 5) {
            return true
        } else if (this.consecutiveLosses > 3) {
            return true
        }

        return false;
    }

    _parseTile(eventObj) {
        const tileObj = eventObj.detail.tileObj
    }

    listen() {
        addEventListener("turnedTile", this._parseTile)
    }

}

module.exports = GameState;