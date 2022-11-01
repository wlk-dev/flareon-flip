const formatSmall = Intl.NumberFormat("en", {notation : "compact"})
const formatBig = Intl.NumberFormat('en', {style: 'decimal', maximumFractionDigits: 0});

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

        this.lastTilesState = this.board.tilesState;
        this.lastTiles = this.board.tiles;
    }

    _flippedTile(high) {
        this.tilesFlipped++;
        if (high) {
            this.highTilesFlipped++
        };
    }

    _resetGameData(hard=false) {
        this.lastTilesState = this.board.tilesState;
        this.lastTiles = this.board.tiles;

        this.board = this._genBoard();
        this.highMults = this.board.getHighMults();

        this.tilesFlipped = 0;
        this.highTilesFlipped = 0;
        this.coins = 0;

        if(hard) {
            this.totalCoins = 0
            this.level = 1;
        };

        // console.trace('reset')
        // console.table(this.board.tiles);
    }

    _genBoard() {
        return new Board();
    }

    _newBoardWin(level) {
        this.totalCoins += this.coins;
        this.level = level;

        this._resetGameData();

        const event = new CustomEvent('levelUp', { detail : { score : this.level * this.totalCoins, level : this.level, totalCoins : this.totalCoins } });
        dispatchEvent(event);
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
        
        coinValue > 1 ? this._flippedTile(true) : this._flippedTile(false); // if its a high multiple tile pass true else false
        coinValue > 1 && this.coins > 0 ? this.coins *= coinValue : this.coins += coinValue;
        
        let reset = true;
        if(demote) {
            this._newBoardLoss(toLevel);
        } else if (this._checkForWin()) {
            this._newBoardWin( this.level += 1 )
        } else {
            reset = false
        }

        const event = new CustomEvent('updateState', { detail : {reset} });
        dispatchEvent(event);
    }

    getBoardData() {
        const data = { current : { tiles : this.board.tiles, tilesState : this.board.tilesState }, prev : { tiles : this.lastTiles, tilesState : this.lastTilesState } }
        return data
    }

    listen() {
        addEventListener("turnedTile", event => this._parseTile(event));
        addEventListener("cantFlip", event => console.log(event))
        addEventListener("resetGame", event => {
            this._resetGameData(true)

            const newEvent = new CustomEvent('updateState', { detail : {reset : false} });
            dispatchEvent(newEvent);
        })
    }

}


class GameInterface {
    constructor(state) {
        this.state = state
        this.state.listen();
        this.loadBoard();

    }

    setTileImg(elem, tileType) {
        switch(tileType) {
            case -1:
                elem.src = "https://i.ibb.co/whzwYPV/My-project.png"
                break;
            case 0:
                elem.src = "https://i.ibb.co/82pFH7N/flareon-1.png"
                break;
            case 1:
                elem.src = "https://i.ibb.co/B4G3T7Y/1667254397926-1.png"
                break;
            case 2:
                elem.src = "https://i.ibb.co/tqG4R7J/1667254471372-1.png"
                break;
            case 3:
                elem.src = "https://i.ibb.co/MkrMFwc/1667254498700-1.png"
                break;
        }
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

    renderBoard(board) {
        const  {tiles, tilesState} = board
        for( let i = 1; i < 6; i++ ) {
            let row = tilesState[i-1]
            $(`.group-${i}`).children().map( (index, tileElem) => {
                if(index !== 5) {
                    tileElem.dataset.tid = `${i-1}-${index}`
                    tileElem.dataset.flipped = row[index] > 0 ? true : false
                    
                    if( row[index] > 0 ? true : false) {
                        this.setTileImg(tileElem, tiles[i-1][index])
                    } else {
                        this.setTileImg(tileElem, -1)
                    }
                }
            })
        }
    }

    updateBoard(detail) { // TODO: Set IMG's here
        this.loadBoard()

        const boardData = this.state.getBoardData()
        const prev = boardData.prev
        const current = boardData.current

        if(detail.reset) {
            this.renderBoard(prev)
            setTimeout(() => this.renderBoard(current), 1000);
        } else {
            this.renderBoard(current)
        }
        
        $("#level").text(this.state.level)
        $("#total-coins").text(this.state.totalCoins)
        $("#coins-current").text(this.state.coins)
    }

    signalMove(event) {
        try {
            let [row, col] = event.target.dataset.tid.split("-")
            let flipped = event.target.dataset.flipped === "true" ? true : false
    
            if(!flipped) {
                this.state.board.turnTile(row, col)
            }
        } catch (err) {
            console.log("Invalid tile target clicked. Here is a traceback incase it was something else : ")
            console.trace(err)
        }

    }

    promptSaveScore(detail) {
        const {score, level, totalCoins} = detail 
        setTimeout( () => {
            Swal.fire({
                title: `Submit score?`,
                text: "The game will be reset after you submit!",
                icon: 'warning',
                footer : `<h2>${level} x ${totalCoins} = ${formatBig.format(score)}</h2>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Submit!',
                cancelButtonText: 'Continue playing...',
                width: 600,
                padding: '3em',
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://64.media.tumblr.com/31d7a5de377cc337fcde5bf77b74e77e/937550501c3990be-7d/s1280x1920/e3f0c2f71a2ae2e2113e1d7bc2ba07d8134054ba.gifv")
                  left top
                  no-repeat
                `
              }).then( resp => {
                if(resp.isConfirmed) {
                    fetch("/api/scores/submit", {
                        method : "POST",
                        body : JSON.stringify({score}),
                        headers : {"Content-Type" : "application/json"}
                    }).then( posted => {
                        if (posted.ok) {
                            Swal.fire({
                                title: 'Score submitted!',
                                footer : "You can view scores on your profile.",
                                icon : "success",
                                timer: 3000,
                                timerProgressBar: true,
                            })
                        } else {
                            Swal.fire({
                                title: 'Failed to submit score...',
                                footer : `Got back ${posted.status}`,
                                icon : "success",
                                timer: 3000,
                                timerProgressBar: true,
                            })
                        }
                    }).catch( err => console.log(err) )

                    const event = new CustomEvent('resetGame');
                    dispatchEvent(event);
                }
              }).catch( err => console.error(err) )
        }, 1000)

    }

    listen() { // add event listener to image group that listens for clicks, check id for `tile` string
        this.updateBoard( {reset : false} )

        addEventListener("updateState", event => this.updateBoard( event.detail ))
        addEventListener("levelUp", event => this.promptSaveScore( event.detail ))

        for(let i = 1; i < 6; i++) {
            $(`.group-${i}`).bind('click', event => this.signalMove(event) )
        }
    }
}

const state = new GameState();
const game = new GameInterface(state);
game.listen();
// game.listen()
// console.table(game.board.tiles)