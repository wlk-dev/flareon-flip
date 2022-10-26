class Board {
    constructor() {
        this.tiles =  Array.from(Array(5), x => this._genRow()); // creates 5x5 table
        this._bomb = 0;
    }

    _getWeightedNum() { // generate a number between 0 and 3 based off of weighted "percentages"
        const weights = [
            { weight : [0,40], value : 0},
            { weight : [40,70], value : 1},
            { weight : [70,90], value : 2},
            { weight : [90,100], value : 3}
        ]
        const num = Math.floor(Math.random() * (101 - 0) + 0)
        return weights.find( (elem) => num >= elem.weight[0] && num <= elem.weight[1]).value
    }

    _genRow() {
        return Array.from(Array(5), x => this._getWeightedNum()) // gen random array of length 5, with weighted numbers
    }

    // _genRow() { // this generates a very hard gameboard
    //     return Array.from(Array(5), x => Math.floor( 4 / (Math.random() * (4 - 1) + 1) )) // creates an array with a length of 5, with weighted random values ranging from 1 to 3
    // }

    _getTileData(row, col) {
        try {
            const value = this.tiles[row][col]
            return { isBomb : value === 1 ? true : false, value }
        } catch(err) {
            console.error(err)
        }
    }

    getRowInfo(row) {
        try {
            const info = { coinTotal : 0, bombTotal : 0 }
            for ( let tile of this.tiles[row] ) {
                tile > this._bomb ? info.coinTotal+=tile : info.bombTotal++;
            }
            return info

        } catch(err) {
            console.error(err)
        }
    }

    getColumnInfo(col) {
        try {
            const info = { coinTotal : 0, bombTotal : 0 }
            for ( let row of this.tiles) {
                let tile = row[col]
                tile > this._bomb ? info.coinTotal+=tile : info.bombTotal++;
            }
            return info

        } catch(err) {
            console.error(err)
        }
    }

    turnTile(row, col) {
        try {
            const event = new CustomEvent('turnedTile', { detail: { tileObj : this._getTileData(row, col) } });
            dispatchEvent(event)
        } catch(err) {
            console.error(err)
        }
    }
}

class State {
    constructor(boards) {
        this.boards = boards
    }

    parseTile(eventObj) {
        const tileObj = eventObj.detail
        console.log( "value", tileObj.value )
    }

    listen() {
        // Add event listeners here
        addEventListener("turnedTile", this.parseTile);
    }
}

const board = new Board()

console.log(board.tiles)

for ( let i = 0; i < 5; i++ ) {
    console.log(board.getRowInfo(i))
}



// const state = new State(x);
// state.listen();


// function emitEvent () {
//     const event = new CustomEvent('turnedTile', { detail: { value : 2 } });
//     dispatchEvent(event);
// }
