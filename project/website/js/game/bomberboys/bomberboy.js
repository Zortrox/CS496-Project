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

var MOVE_TIMEOUT = 10;
var BOMB_TIMEOUT = 40;

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
	var starting_positions = [[1,1],[BOARD_MAT[0].length-2,BOARD_MAT.length-2],[1,BOARD_MAT.length-2],[BOARD_MAT[0].length-2,1]];
	var count = 0;
	for(var i = 0; i < GAME.playerIDs.length; i++){
		var properties = {};
		properties[""+GAME.playerIDs[i]+"_xPos"] = starting_positions[count][0];
		properties[""+GAME.playerIDs[i]+"_yPos"] = starting_positions[count][1];
		properties[""+GAME.playerIDs[i]+"_lastMove"] = 100;
		properties[""+GAME.playerIDs[i]+"_lastBomb"] =  100;
		properties[""+GAME.playerIDs[i]+"_currentMove"] = [0,0];
		properties[""+GAME.playerIDs[i]+"_alive"] = true;
		GAME.canvs["board"].addDynamicObject(""+GAME.playerIDs[i], ()=>{}, properties, playerUpdate);
		BOARD_MAT[starting_positions[count][1]][starting_positions[count][0]] = PLAYER;
		count++;
	}
	setupControls();
}

function setupControls(){
	GAME.setControlHandler((uuid, data) => {
		if(GAME.params[uuid+"_alive"]){
			if(data["up"] == 1){
				GAME.params[uuid+"_currentMove"] = [0,-1];
			} else if(data["right"] == 1){
				GAME.params[uuid+"_currentMove"] = [1, 0];
			} else if(data["down"] == 1){
				GAME.params[uuid+"_currentMove"] = [0,1];
			} else if(data["left"] == 1){
				GAME.params[uuid+"_currentMove"] = [-1,0];
			}
			if(data["a"] == 1 || data["b"] == 1){
				requestBomb(uuid);
			}
		}
	});
	GAME.startGame();
}

function drawBoard(){
	var sqwidth = (window.innerWidth-25)/BOARD_MAT[0].length;
	var sqheight = (window.innerHeight-25)/BOARD_MAT.length;
	for(var i = 0; i < BOARD_MAT.length; i++){
		for(var j = 0; j < BOARD_MAT[i].length; j++){
			if(BOARD_MAT[i][j] == TEMP){
				GAME.canvs["board"].ctx.beginPath();
				GAME.canvs["board"].ctx.rect(sqwidth*j,sqheight*i,sqwidth,sqheight);
				GAME.canvs["board"].ctx.fillStyle = "#A0522D";
				GAME.canvs["board"].ctx.strokeStyle = "#A0522D";
				GAME.canvs["board"].ctx.fill();
				GAME.canvs["board"].ctx.stroke();
			} else if(BOARD_MAT[i][j] >= EXPLOSION){
				if(++BOARD_MAT[i][j] - EXPLOSION > 10){
					BOARD_MAT[i][j] = 0;
				} else {
					GAME.canvs["board"].ctx.beginPath();
					GAME.canvs["board"].ctx.rect(sqwidth*j,sqheight*i,sqwidth,sqheight);
					GAME.canvs["board"].ctx.fillStyle = "#FF0000";
					GAME.canvs["board"].ctx.fill();
					GAME.canvs["board"].ctx.stroke();
				}
			} else if (BOARD_MAT[i][j] == PLAYER){
				drawPlayer(j,i, sqwidth, sqheight);
			} else if (BOARD_MAT[i][j] == PLAYER_BOMB){
				drawPlayer(j,i, sqwidth, sqheight);
				drawBomb(j,i, sqwidth, sqheight);
			} else if (BOARD_MAT[i][j] == BOMB){
				drawBomb(j,i, sqwidth, sqheight);
			} else if(BOARD_MAT[i][j] == DEATH){
				GAME.canvs["board"].ctx.beginPath();
				GAME.canvs["board"].ctx.strokeStyle = "#FFF";
				GAME.canvs["board"].ctx.moveTo(sqwidth*j + sqwidth/2, sqheight*i);
				GAME.canvs["board"].ctx.lineTo(sqwidth*j + sqwidth/2, sqheight*(i+1));
				GAME.canvs["board"].ctx.stroke();
				GAME.canvs["board"].ctx.moveTo(sqwidth*j, sqheight*i + sqheight/3);
				GAME.canvs["board"].ctx.lineTo(sqwidth*(j+1), sqheight*i + sqheight/3);
				GAME.canvs["board"].ctx.stroke();
			}
			GAME.canvs["board"].strokeStyle = "#FFF";
			GAME.canvs["board"].fillStyle = "#FFF";
		}
	}
	GAME.canvs["board"].ctx.closePath();
}

function drawPlayer(x, y, w, h){
	for(var i = 0; i < GAME.playerIDs.length; i++){
		var uuid = GAME.playerIDs[i];
		if(GAME.params[uuid+"_xPos"] == x && GAME.params[uuid+"_yPos"] == y){
			GAME.canvs["board"].ctx.beginPath();
			GAME.canvs["board"].ctx.fillStyle = PLAYER_COLORS[i];
			GAME.canvs["board"].ctx.strokeStyle = PLAYER_COLORS[i];
			GAME.canvs["board"].ctx.moveTo(w*x + w/2, h*y);
			GAME.canvs["board"].ctx.lineTo(w*(x+1), h*y + h/2);
			GAME.canvs["board"].ctx.stroke();
			GAME.canvs["board"].ctx.lineTo(w*x + w/2, h*(y+1));
			GAME.canvs["board"].ctx.stroke();
			GAME.canvs["board"].ctx.lineTo(w*x, h*y + h/2);
			GAME.canvs["board"].ctx.stroke();
			GAME.canvs["board"].ctx.lineTo(w*x + w/2, h*y);
			GAME.canvs["board"].ctx.fill();
			GAME.canvs["board"].ctx.stroke();
			break;
		}
	}
}

function drawBomb(x, y, w, h){
	if (w > h){
		var small = h-3;
	} else {
		var small = w-3;
	}
	GAME.canvs["board"].ctx.beginPath();
	GAME.canvs["board"].ctx.fillStyle = "#FF0000";
	GAME.canvs["board"].ctx.strokeStyle = "#FF0000";
	GAME.canvs["board"].ctx.moveTo(x*w + w/2, y*h + h/2);
	GAME.canvs["board"].ctx.arc(x*w + w/2, y*h + h/2, small/3, 0, 2*Math.PI);
	GAME.canvs["board"].ctx.fill();
	GAME.canvs["board"].ctx.stroke();
}

function playerUpdate(){
	if(GAME.params[this.id+"_alive"]){
		GAME.params[this.id+"_lastBomb"]++;
		if(++GAME.params[this.id+"_lastMove"] >= MOVE_TIMEOUT){
			if(!(GAME.params[this.id+"_currentMove"][0] == 0 && GAME.params[this.id+"_currentMove"][1] == 0)){
				if(requestMove(this.id, GAME.params[this.id+"_currentMove"])){
					GAME.params[this.id+"_lastMove"] = 0;
				}
			}
		}
	}
}

function requestMove(id, move){
	var startX = GAME.params[id+"_xPos"];
	var startY = GAME.params[id+"_yPos"];
	if(startX + move[0] >= 0 && startX + move[0] < BOARD_MAT[startY].length && startY + move[1] >= 0
		&& startY + move[1] < BOARD_MAT.length){
		if(BOARD_MAT[startY + move[1]][startX + move[0]] == EMPTY){
			if(BOARD_MAT[startY][startX] == PLAYER_BOMB){
				BOARD_MAT[startY][startX] = BOMB;
			} else {
				BOARD_MAT[startY][startX] = EMPTY;
			}
			BOARD_MAT[startY+move[1]][startX+move[0]] = PLAYER;
			GAME.params[id+"_xPos"] = startX + move[0];
			GAME.params[id+"_yPos"] = startY + move[1];
			GAME.params[id+"_currentMove"] = [0,0];
			return true;
		}
	}
	return false;
}

function requestBomb(id){
	var startX = GAME.params[id+"_xPos"];
	var startY = GAME.params[id+"_yPos"];
	if(GAME.params[id+"_lastBomb"] >= BOMB_TIMEOUT && BOARD_MAT[startY][startX] != PLAYER_BOMB 
		&& !GAME.canvs["board"].dynamicObjects[id+"_bomb"]){
		BOARD_MAT[startY][startX] = PLAYER_BOMB;
		GAME.params[id+"_lastBomb"] = 0;
		var properties = {};
		properties[""+id+"_bomb_xPos"] = startX;
		properties[""+id+"_bomb_yPos"] = startY;
		properties[""+id+"_bomb_timer"] = BOMB_TIMEOUT-1;
		GAME.canvs["board"].addDynamicObject(id+"_bomb", ()=>{}, properties, bombUpdate);
		return true;
	}
	return false;
}

function bombUpdate(){
	if(--GAME.params[this.id+"_timer"] <= 0){
		explode(GAME.params[this.id+"_xPos"], GAME.params[this.id+"_yPos"]);
		this.expired = true;
	}
}

function explode(x, y){
	if(BOARD_MAT[y][x] == PLAYER_BOMB){
		killPlayer(x, y);
	}
	BOARD_MAT[y][x] = EXPLOSION;
	for(var k = -1; k <= 1; k+=2){
		for(var i = 1; i <= 2; i++){
			if((x+(i*k)) >= 0 && (x+(i*k)) < BOARD_MAT[0].length && BOARD_MAT[y][x+(i*k)] != BLOCKED 
				&& BOARD_MAT[y][x+(i*k)] != DEATH){
				if(BOARD_MAT[y][x+(i*k)] == PLAYER){
					killPlayer(x+(i*k), y);
				} else if(BOARD_MAT[y][x+(i*k)] == PLAYER_BOMB){
					killPlayer(x+(i*k), y);
					explode(x+(i*k), y);
				} else if(BOARD_MAT[y][x+(i*k)] == BOMB){
					killBomb(x+(i*k), y);
					explode(x+(i*k), y);
				} else {
					BOARD_MAT[y][x+(i*k)] = EXPLOSION;
				}
			} else {
				break;
			}
		}
	}
	for(var k = -1; k <= 1; k+=2){
		for(var j = 1; j <= 2; j++){
			if((y+(j*k)) >= 0 && (y+(j*k)) < BOARD_MAT.length && BOARD_MAT[y+(j*k)][x] != BLOCKED
				&& BOARD_MAT[y+(j*k)][x] != DEATH){
				if(BOARD_MAT[y+(j*k)][x] == PLAYER){
					killPlayer(x, y+(j*k));
				} else if(BOARD_MAT[y+(j*k)][x] == PLAYER_BOMB){
					killPlayer(x, y+(j*k));
					explode(x, y+(j*k));
				} else if(BOARD_MAT[y+(j*k)][x] == BOMB){
					killBomb(x, y+(j*k));
					explode(x, y+(j*k));
				} else {
					BOARD_MAT[y+(j*k)][x] = EXPLOSION;	
				}
			} else{
				break;
			}
		}
	}
}

function killPlayer(x, y){
	var aliveCount = 0;
	for(var i = 0; i < GAME.playerIDs.length; i++){
		if(GAME.params[GAME.playerIDs[i]+"_alive"]){
			if(GAME.params[GAME.playerIDs[i]+"_xPos"] == x && GAME.params[GAME.playerIDs[i]+"_yPos"] == y){
				for(var j = 0; j < GAME.canvs["board"].dynamicObjects.length; j++){
					if(GAME.canvs["board"].dynamicObjects[j].id == GAME.playerIDs[i]){
						GAME.canvs["board"].dynamicObjects[j].expired = true;
						BOARD_MAT[y][x] = DEATH;
						GAME.params[GAME.playerIDs[i]+"_alive"] = false;
						break;
					}
				}
			} else {
				aliveCount++;
			}
		}
	}
	if(aliveCount == 1){
		drawBoard();
		GAME.endGame(displayEnd);
	}
}

function killBomb(x, y){
	for(var i = 0; i < GAME.playerIDs.length; i++){
		if(GAME.params[GAME.playerIDs[i]+"_bomb_xPos"] == x && GAME.params[GAME.playerIDs[i]+"_bomb_yPos"] == y){
			GAME.canvs["board"].dynamicObjects[""+GAME.playerIDs[i]+"_bomb"].expired = true;
		}
	}
}

function readBoard(b){
	var splitB = b.split(",");
	for(var i = 0; i < splitB.length; i++){
		splitB[i] = splitB[i].trim().split('');
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
