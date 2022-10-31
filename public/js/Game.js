class Board {
    constructor() {
        this.tiles =  Array.from(Array(5), x => this._genRow()); // creates 5x5 table
        this.tilesState = Array.from(Array(5), x => Array(5).fill(0)); // 0 = un-flipped, 1 = flipped
        this.memoState = Array.from(Array(5), x => Array(5).fill(0));
        this._bomb = 0;
    }

    _getWeightedNum() { // generate a number between 0 and 3 based off of weighted "percentages"
        const weights = [
            { weight : [0,40], value : 0},
            { weight : [40,70], value : 1},
            { weight : [70,90], value : 2},
            { weight : [90,100], value : 3}
        ];
        const randInt = Math.floor(Math.random() * (101 - 0) + 0);
        return weights.find((elem) => randInt >= elem.weight[0] && randInt <= elem.weight[1]).value;
    }

    _genRow() {
        return Array.from(Array(5), x => this._getWeightedNum()) // gen random array of length 5, with weighted numbers
    }

    // _genRow() { // this generates a very hard gameboard
    //     return Array.from(Array(5), x => Math.floor( 4 / (Math.random() * (4 - 1) + 1) )) // creates an array with a length of 5, with weighted random values ranging from 1 to 3
    // }

    _getTileData(row, col) {
        try {
            const coinValue = this.tiles[row][col]
            return { isBomb : coinValue === this._bomb ? true : false, coinValue }
        } catch(err) {
            console.error(err)
        }
    }

    getHighMults() {
        let numOfMults = 0;
        for( const row of this.tiles ) {
            row.forEach( tile => tile > 1 ? numOfMults++ : null );
        }
        return numOfMults;
    }

    getRowInfo(row) {
        try {
            const info = { coinTotal : 0, bombTotal : 0 }
            for ( const tile of this.tiles[row] ) {
                tile > this._bomb ? info.coinTotal+=tile : info.bombTotal++; // if tile value is not bomb then increment coin total else increment bomb total
            }
            return info

        } catch(err) {
            console.error(err)
        }
    }

    getColumnInfo(col) {
        try {
            const info = { coinTotal : 0, bombTotal : 0 }
            for ( const row of this.tiles) {
                let tile = row[col]
                tile > this._bomb ? info.coinTotal+=tile : info.bombTotal++; // same as getRowInfo just with cols
            }
            return info

        } catch(err) {
            console.error(err)
        }
    }

    getRowData(row, ofBoard=this.tiles) {
        try {
            return {data : ofBoard[row], row};
        } catch(err) {
            console.error(err)
        }
    }

    getColumnData(col, ofBoard=this.tiles) {
        try {
            return { data : ofBoard.map( row => row[col] ), col }
        } catch(err) {
            console.error(err)
        }
    }

    turnTile(row, col, forceEvent=false) { // we can force a retrieval of tileData via event if we need to
        try {
            const tileState = this.tilesState[row][col];
            if(tileState || forceEvent) {
                const event = new CustomEvent('cantFlip', {detail : { targetTile : [row, col], targetState : tileState }}) // TODO: better event names
                dispatchEvent(event) // dispatch event if the tile can't be flipped, can be used for user feedback or memos'
                return;
            }
            const event = new CustomEvent('turnedTile', { detail: { tileObj : { ...this._getTileData(row, col), targetTile : [row, col] }} });
            this.tilesState[row][col] = 1
            dispatchEvent(event)
        } catch(err) {
            console.error(err)
        }
    }
}

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
        if (high) {
            this.highTilesFlipped++
        };
    }

    _resetGameData() {
        this.board = this._genBoard();
        this.highMults = this.board.getHighMults();

        this.tilesFlipped = 0;
        this.highTilesFlipped = 0;
        this.coins = 0;

        console.trace('reset')
        console.table(this.board.tiles);
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
            return { demote : true, toLevel : this.tilesFlipped < this.level ? 1 : ( this.level === 1 ? 1 : this.level-1 ) };
        }

        return {demote : false, toLevel : this.level};
    }

    _checkForWin() {
        return this.highTilesFlipped == this.highMults
    }

    _parseTile(eventObj) {
        const {isBomb, coinValue, targetTile} = eventObj.detail.tileObj;
        const {demote, toLevel} =  this._checkForDemotion( isBomb );
        
        console.log(this.board.getRowData( targetTile[0] ), demote, toLevel)
        
        coinValue > 1 ? this._flippedTile(true) : this._flippedTile(false); // if its a high multiple tile pass true else false
        this.coins > 1 ? this.coins *= coinValue : this.coins += coinValue;

        if(demote) {
            this._newBoardLoss(toLevel);
        } else if (this._checkForWin()) {
            this._newBoardWin( this.level += 1 )
        }
        
        const event = new CustomEvent('updateState', { detail : { boardState : this.board.tilesState } });
        dispatchEvent(event);
    }

    listen() {
        addEventListener("turnedTile", event => this._parseTile(event));
        addEventListener("cantFlip", event => console.log(event))
    }

}


class GameInterface {
    constructor(state) {
        this.state = state
        this.state.listen();
        this.loadBoard();
    }

    loadBoard() {
        let rows = []; let cols = [];
        for( let i = 0; i < 5; i++ ) {
            rows.push( { row : i, data : this.state.board.getRowInfo(i)} )
            cols.push( { col : i, data : this.state.board.getColumnInfo(i)} ) // prolly also map these
        }

        rows.map( data => {
            let [coins, bombs] = [...$(`.row_0-${data.row+1}`).children()]

            $(coins).text(data.data.coinTotal)
            $(bombs).text(data.data.bombTotal)
        });

        cols.map( data => {
            let [coins, bombs] = [...$(`.row_${data.col+1}-0`).children()]

            $(coins).text(data.data.coinTotal)
            $(bombs).text(data.data.bombTotal)
        });

    }

    updateBoard(board) {
        for( let i = 0; i < 5; i++ ) {
            this.state.board.getRowData(i, board) // map these over game element
            this.state.board.getColumnData(i, board)
        }

        console.log('here', board, this.state.coins)

        $("#level").text(this.state.level)
        $("#total-coins").text(this.state.totalCoins)
        $("#coins-current").text(this.state.coins)

        // It honestly doesn't matter the order of the ID's
        // Just let the interface handle the parsing between them, it will honestly work out
        // Because the client doesn't need to be aware of the actual order of the board as long as it follows the same sort of structure

    }

    listen() { // add event listener to image group that listens for clicks, check id for `tile` string
        addEventListener("updateState", event => this.updateBoard( event.detail.boardState ))
    }
}

const state = new GameState();
const game = new GameInterface(state);
game.listen();
// game.listen()
// console.table(game.board.tiles)