var BOARD_MAT;
var GAME;

//constants for use in game matrix
var EMPTY = 0;
var BLOCKED = 1;
var TEMP = 2;
var PLAYER = 3;
var PLAYER_BOMB = 4;
var BOMB = 5;
var DEATH = 6;
var EXPLOSION = 7;

var  PLAYER_COLORS = ["#f3e274", "#bd3b0c", "#a75b51", "#096c74"];

var MOVE_TIMEOUT = 15;
var BOMB_TIMEOUT = 50;

function setup(){
	GAME = new Game(2,4);

	BOARD_MAT = readBoard(board1);

	GAME.addCanvas("board", window.innerWidth-25, window.innerHeight-25, "");

	drawStaticBoard(GAME.canvs["board"], (window.innerWidth-25)/BOARD_MAT[0].length, (window.innerHeight-25)/BOARD_MAT.length);
	GAME.canvs["board"].setBaseState();
	GAME.canvs["board"].addDynamicObject("tempBoard", drawBoard, {}, ()=>{});
	GAME.startLobby(setupPlayers);
}

function setupPlayers(){
	var starting_positions = [[0,0],[BOARD_MAT[0].length-1,BOARD_MAT.length-1],[0,BOARD_MAT.length-1],[BOARD_MAT[0].length-1,0]];
	var count = 0;
	for(uuid in GAME.playerIDs){
		GAME.canvs["board"].addDynamicObject(uuid, ()=>{}, {
			uuid+"_xPos" : starting_positions[count][0],
			uuid+"_yPos" : starting_positions[count][1],
			uuid+"_lastMove" : 100,
			uuid+"_lastBomb" : 100,
			uuid+"_currentMove" : [0,0],
			uuid+"_alive" : true
		}, playerUpdate);
		count++;
	}
	setupControls();
}

function setupControls(){
	GAME.setControlHandler((uuid, data) => {
			if(GAME.params[uuid+"_alive"]){
			if(data["up"] === 1){
				GAME.params[uuid+"_currentMove"] = [0,-1];
			} else if(data["right"] === 1){
				GAME.params[uuid+"_currentMove"] = [1, 0];
			} else if(data["down"] === 1){
				GAME.params[uuid+"_currentMove"] = [0,1];
			} else if(data["left"] === 1){
				GAME.params[uuid+"_currentMove"] = [-1,0];
			} else{
				GAME.params[uuid+"_currentMove"] = [0,0];
			}
			if(data["a"] === 1 || data["b"] === 1){
				requestBomb(uuid);
			}
		}
	}
	GAME.startGame();
}

function drawBoard(){
	var sqwidth = (window.innerWidth-25)/BOARD_MAT[0].length;
	var sqheight = (window.innerHeight-25)/BOARD_MAT.length;
	GAME.canvs["board"].ctx.beginPath();
	for(var i = 0; i < BOARD_MAT.length; i++){
		for(var j = 0; j < BOARD_MAT[i].length; j++){
			if(board[i][j] == TEMP){
				GAME.canvs["board"].ctx.rect(sqwidth*j,sqheight*i,sqwidth,sqheight);
				GAME.canvs["board"].ctx.fillStyle = "#A0522D";
				GAME.canvs["board"].ctx.fill();
				GAME.canvs["board"].ctx.stroke();
			} else if(board[i][j] >= EXPLOSION){
				if(++board[i][j] - EXPLOSION > 10){
					board[i][j] = 0;
				} else {
					GAME.canvs["board"].ctx.rect(sqwidth*j,sqheight*i,sqwidth,sqheight);
					GAME.canvs["board"].ctx.fillStyle = "#FF0000";
					GAME.canvs["board"].ctx.fill();
					GAME.canvs["board"].ctx.stroke();
				}
			} else if (board[i][j] === PLAYER){
				drawPlayer(i,j, sqwidth, sqheight);
			} else if (board[i][j] === PLAYER_BOMB){
				drawPlayer(i,j, sqwidth, sqheight);
				drawBomb(i,j, sqwidth, sqheight);
			} else if (board[i][j] === BOMB){
				drawBomb(i,j, sqwidth, sqheight);
			} else if(board[i][j] === DEATH){
				GAME.canvs["board"].ctx.moveTo(sqwidth*j + sqwidth/2, sqheight*i);
				GAME.canvs["board"].ctx.lineTo(sqwidth*j + sqwidth/2, sqheight*(i+1));
				GAME.canvs["board"].ctx.stroke();
				GAME.canvs["board"].ctx.moveTo(sqwidth*j, sqheight*i + sqheight/3);
				GAME.canvs["board"].ctx.lineTo(sqwidth*(j+1), sqheight*i + sqheight/3);
				GAME.canvs["board"].ctx.stroke();
			}
		}
	}
	GAME.canvs["board"].ctx.closePath();
}

function drawPlayer(x, y, w, h){
	for(var i = 0; i < GAME.playerIDs.length; i++){
		var uuid = GAME.playerIDs[i];
		if(GAME.params[uuid+"_xPos"] === x && GAME.params[uuid+"_yPos"] === y){
			GAME.canvs["board"].ctx.strokeStyle = PLAYER_COLORS[i];
			GAME.canvs["board"].ctx.moveTo(w*x + w/2, h*y);
			GAME.canvs["board"].ctx.lineTo(w*(x+1), h*y + h/2);
			GAME.canvs["board"].ctx.stroke();
			GAME.canvs["board"].ctx.lineTo(w*x + w/2, h*(y+1));
			GAME.canvs["board"].ctx.stroke();
			GAME.canvs["board"].ctx.lineTo(w*x, h*y + h/2);
			GAME.canvs["board"].ctx.stroke();
			GAME.canvs["board"].ctx.strokeStyle = "#000";
			break;
		}
	}
}

function drawBomb(x, y, w, h){
	if (w > h){
		var small = h;
	} else {
		var small = x;
	}
	GAME.canvs["board"].ctx.arc(x*w + w/2, y*h + h/2, small, 0, 2*Math.PI);
	GAME.canvs["board"].ctx.stroke();
}

function playerUpdate(){
	GAME.params[this.id+"_lastBomb"]++;
	if(++GAME.params[this.id+"_lastMove"] >= MOVE_TIMEOUT){
		if(!(GAME.params[this.id+"_currentMove"][0] === 0 && GAME.params[this.id+"_currentMove"][1] === 0)){
			if(requestMove(this.id, GAME.params[this.id+"_currentMove"])){
				GAME.params[this.id+"_lastMove"] = 0;
			}
		}
	}
}

function requestMove(id, move){
	var startX = GAME.params[id+"_xPos"];
	var startY = GAME.params[id+"_yPos"];
	if(startX + move[0] >= 0 && startX + move[0] < BOARD_MAT[startY].length && startY + move[1] >= 0
		&& startY + move[1] < BOARD_MAT.length){
		if(BOARD_MAT[startX + move[0]][startY + move[1]] === EMPTY){
			if(BOARD_MAT[startX][startY] === PLAYER_BOMB){
				BOARD_MAT[startX][startY] = BOMB;
			} else {
				BOARD_MAT[startX][startY] = EMPTY;
			}
			BOARD_MAT[startX+move[0]][startY+move[1]] = PLAYER;
			GAME.params[id+"_xPos"] = startX + move[0];
			GAME.params[id+"_yPos"] = startY = move[1];
			return true;
		}
	}
	return false;
}

function requestBomb(id){
	var startX = GAME.params[id+"_xPos"];
	var startY = GAME.params[id+"_yPos"];
	if(GAME.params[id+"_lastBomb"] >= BOMB_TIMEOUT && BOARD_MAT[startX][startY] !== PLAYER_BOMB 
		&& !GAME.canvs["board"].dynamicObjects[id+"_bomb"]){
		BOARD_MAT[startX][startY] = PLAYER_BOMB;
		GAME.params[id+"_lastBomb"] = 0;
		GAME.canvs["board"].addDynamicObject(id+"_bomb", ()=>{}, {
			id+"_bomb_xPos" : starting_positions[count][0],
			id+"_bomb_yPos" : starting_positions[count][1],
			id+"_bomb_timer" : BOMB_TIMEOUT-1
		}, bombUpdate);
		return true;
	}
	return false;
}

function bombUpdate(){
	if(--GAME.params[this.id+"_timer"] <= 0){
		explode(GAME.params[this.id+"_xPos"], GAME.params[this.id+"_yPos"]);
		GAME.canvs["board"].dynamicObjects[this.id+"_bomb"].expired = true;
	}
}

function explode(x, y){
	BOARD_MAT[x][y] = EXPLOSION;
	for(var k = -1; k <= 1; k+=2){
		for(var i = 1; i <= 2; i++){
			if((x+(i*k)) >= 0 && (x+(i*k)) < BOARD_MAT[0].length && BOARD_MAT[x+(i*k)][y] !== BLOCKED 
				&& BOARD_MAT[x+(i*k)][y] !== DEATH){
				if(BOARD_MAT[x+(i*k)][y] === PLAYER){
					killPlayer(x+(i*k), y);
				} else if(BOARD_MAT[x+(i*k)][y] === PLAYER_BOMB){
					killPlayer(x+(i*k), y);
					explode(x+(i*k), y);
				} else if(BOARD_MAT[x+(i*k)][y] === BOMB){
					killBomb(x+(i*k), y);
					explode(x+(i*k), y);
				} else {
					BOARD_MAT[x+(i*k)][y] = EXPLOSION;
				}
			} else {
				break;
			}
		}
	}
	for(var k = -1; k <= 1; k+=2){
		for(var j = 1; j <= 2; j++){
			if((y+(j*k)) >= 0 && (y+(j*k)) < BOARD_MAT.length && BOARD_MAT[x][y+(j*k)] !== BLOCKED
				&& BOARD_MAT[x][y+(j*k)] !== DEATH){
				if(BOARD_MAT[x][y+(j*k)] === PLAYER){
					killPlayer(x, y+(j*k));
				} else if(BOARD_MAT[x][y+(j*k)] === PLAYER_BOMB){
					killPlayer(x, y+(j*k));
					explode(x, y+(j*k));
				} else if(BOARD_MAT[x][y+(j*k)] === BOMB){
					killBomb(x, y+(j*k));
					explode(x, y+(j*k));
				} else {
					BOARD_MAT[x][y+(j*k)] = EXPLOSION;	
				}
			} else{
				break;
			}
		}
	}
}

function killPlayer(x, y){
	var aliveCount = 0;
	for(uuid in GAME.playerIDs){
		if(GAME.params[uuid+"_alive"]){
			if(GAME.params[uuid+"_xPos"] === x && GAME.params[uuid+"_yPos"] === y){
				GAME.canvs["board"].dynamicObjects[""+uuid].expired = true;
				BOARD_MAT[x][y] = DEATH;
				GAME.params[uuid+"_alive"] = false;
			} else {
				aliveCount++;
			}
		}
	}
	if(aliveCount === 1){
		GAME.endGame(displayEnd);
	}
}

function killBomb(x, y){
	for(uuid in GAME.playerIDs){
		if(GAME.params[uuid+"_bomb_xPos"] === x && GAME.params[uuid+"_bomb_yPos"] === y){
			GAME.canvs["board"].dynamicObjects[""+uuid+"_bomb"].expired = true;
		}
	}
}

function readBoard(b){
	var splitB = b.split(",");
	for(var i = 0; i < splitB.length; i++){
		splitB[i] = splitB[i].split('');
	}
	return splitB;
}

function displayEnd(){
	//display winner here
	alert("Game over!");
}

function drawStaticBoard(canv, width, height){
	canv.ctx.beginPath();
	for(var i = 0; i < BOARD_MAT.length; i++){
		for(var j = 0; j <BOARD_MAT[i].length; j++){
			if(BOARD_MAT[i][j] == 1){
				canv.ctx.rect(width*j,height*i,width,height);
				canv.ctx.fillStyle = "#000";
				canv.ctx.fill();
				canv.ctx.stroke();
			}
		}
	}
	canv.ctx.closePath();
}

window.onload = () => setup();


var board1=`
11111111111111111111111111111111111111111,
10000000000000000000000000000000000000001,
10021200100212021200100012021000100210001,
10100212021202120010021000100012021002101,
10001200120210001002100212021200120212001,
10100212001202120012001200120212001000101,
10021202100212001000100212021002120010001,
10120212021200100210021200100210021002101,
10001202120212001202120210021200120010001,
10120212001202100212021200100010001202101,
10021202100210021002100210021202120212001,
10120212001200120210001202120212001202101,
10021202120212001000120210001200100210001,
10120212021202120212021202120012001002101,
10021202100212001202120210021002120210001,
10120212001202120012021202120010021000101,
10000000000000000000000000000000000000001,
11111111111111111111111111111111111111111
`