const { uuid } = require("../utils/helpers")

// TODO: Add functions to retrieve exact, row info for tile mapping
class Board {
    constructor(level) {
        this.tiles =  Array.from(Array(5), x => this._genRow(level)); // creates 5x5 table
        this.tilesState = Array.from(Array(5), x => Array(5).fill(0)); // 0 = un-flipped, 1 = flipped
        this.memoState = Array.from(Array(5), x => Array(5).fill(0));
        this._bomb = 0;
        this.board_id = uuid();
    }

    _getWeightedNum(level) { // generate a number between 0 and 3 based off of weighted "percentages"
        const weights = [
            { weight : [0,40], value : 0},
            { weight : [40,70], value : 1},
            { weight : [70,90], value : 2},
            { weight : [90,100], value : 3}
        ];
        const randInt = Math.floor(Math.random() * (101 - 0) + 0);
        const randModifier = Math.ceil(Math.random() * (level - 1), + 1);
        let num = weights.find((elem) => randInt >= elem.weight[0] && randInt <= elem.weight[1]).value;
        console.log(Math.ceil( num / randModifier ))
    }

    _genRow(level) {
        return Array.from(Array(5), x => this._getWeightedNum(level)) // gen random array of length 5, with weighted numbers
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
            if(!tileState && !forceEvent) {
                const event = new CustomEvent('cantFlip', {detail : { targetTile : [row, col], targetState : tileState }}) // TODO: better event names
                dispatchEvent(event) // dispatch event if the tile can't be flipped, can be used for user feedback or memos'
                return;
            }
            const event = new CustomEvent('turnedTile', { detail: { tileObj : this._getTileData(row, col) } });
            this.tilesState[row][col] = 1
            dispatchEvent(event)
        } catch(err) {
            console.error(err)
        }
    }
}

const x = new Board(4);
// console.log(x.tiles)
// console.log(x.getHighMults())
// x.tilesState[0][0] = 1
// console.log(x.getRowData(0, x.tilesState))
// console.log(x.getColumnData(0, x.tilesState))
// x.tilesState[4][4] = 1
// console.log(x.tilesState)

module.exports = Board;