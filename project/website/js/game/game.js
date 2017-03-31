//Game API


var MSG_TYPE_NEW_PLAYER_JOIN = 1;
var MSG_TYPE_CONTROL_DATA = 2;

//-------------------------------------------------------------------------------------

//DynamicObject
//Object that represents a single moving/dynamic sprite
function DynamicObject(id, drawFunction, canv, params, updateFunction){
	this.id = id;
	this.params = params; //params should be a list of ids that correspond to the game's parameter id list
	this.canv = canv;
	this.draw = drawFunction;
	this.update = updateFunction;	//function to update position/parameters of object
	this.expired = false; //set expired to true when object is ready to be deleted
}

//-------------------------------------------------------------------------------------

//Canvas Object
//Object that represents a single display region
function Canvas(canv, game){
	var baseState = null;
	this.htmlCanv = canv;
	this.game = game;
	this.ctx = this.htmlCanv.getContext("2d");
	this.dynamicObjects = [];

	function resetToBaseState(obj){
		obj.ctx.putImageData(baseState, 0, 0);
	}

	function drawObjects(obj){
		var i = 0;
		var boundary = obj.dynamicObjects.length;
		while(i < boundary){
			obj.dynamicObjects[i].update();
			if(obj.dynamicObjects[i].expired){
				obj.dynamicObjects.splice(i,1);
				boundary--;
			} else {
				obj.dynamicObjects[i].draw();
				i++;
			}
		}
	}

	this.setBaseState = function(){
		baseState = this.ctx.getImageData(0, 0, this.htmlCanv.width, this.htmlCanv.height);
	}

	this.addDynamicObject = function(id, drawFunction, params, updateFunction){
		var obj = new DynamicObject(id, drawFunction, this, params, updateFunction);
		for (var prop in obj.params) {
	    if (obj.params.hasOwnProperty(prop)) {
	    		if(!this.game.params.hasOwnProperty(prop)){
	        	this.game.params[""+prop] = obj.params[""+prop];
	      	} else {
	      		//TODO: throw error for repeated property
	      	}
	    }
		}
		this.dynamicObjects.push(obj);
	}

	//pseudo-private (should only be accessible to Game)

	this.updateCanvas = function(){
		resetToBaseState(this);
		drawObjects(this);
	}
}

//-------------------------------------------------------------------------------------

//Game Object
//Master object for a unique game instance
//When the Game developer submits the game, they will be responsible for specifying 
//min players, max players, and corresponding controller ID
function Game(){
	var htmlBod = document.getElementsByTagName("body")[0];
	var frame_rate = 33;
	var active = true;
	var gameStarter = null;
	var lobbyComplete = false;
	var gameServerSocket = null;
	var portNumber = null;
	this.playerCount = 0;
	this.params = {};
	this.canvs = [];
	this.htmlObjects = [];	//non-canvas HTML elements
	this.controlHandler = null;

	function setupControls(obj){
		//sample for Pong
		window.onkeydown = function(e){
			var control = null;
			if(e.key === "ArrowUp"){
				control = [0,-1];
			} else if(e.key === "ArrowDown"){
				control = [0,1];
			} else if(e.key === "w"){
				control = [-1,0];
			} else if(e.key === "s"){
				control = [1,0];
			} else {
				control = [0,0];
				return;
			}
			obj.controlHandler(control);
		}
	}

	function gameRefresh(obj){
		for(canv in obj.canvs){
			obj.canvs[canv].updateCanvas();	
		}
	}

	function gameLoop(obj){
		if(active){
			gameRefresh(obj);
			setTimeout(function(){
				gameLoop(obj);
			}, 1000/frame_rate);
		}
	}

	//all HTML element insertions (Canvas or other) insert the new element as the first element in body
	//canvas is created using given style specs
	this.addCanvas = function(canvID,canvWidth,canvHeight,canvStyle){
		var canv = document.createElement("canvas");
		canv.id = canvID;
		canv.width = canvWidth;
		canv.height = canvHeight;
		canv.style = canvStyle;
		this.canvs[""+canvID] = new Canvas(canv, this);
		htmlBod.insertBefore(canv, htmlBod.firstChild);
	}

	this.addHTMLObject = function(obj,objID){
		document.getElementsByTagName("body")[0].insertBefore(obj,htmlBod.firstChild);
		this.htmlObjects[""+objID] = obj;
	}

	this.addParam = function(id, defValue){
		this.params[""+id] = defValue;
	}

	this.startLobby = function(callback){
		//do lobby stuff
		var message = {
			name:getCookie("name"),
			room:getCookie("gameroom"),
			uuid:getCookie("uuid")
		}

		gameServerSocket = new WebSocket("http://digibara.com/ws");
		var _this = this;
		gameServerSocket.onmessage = function(msg){
			var pack = JSON.parse(msg.data);
			if(pack.msgtype == MSG_TYPE_NEW_PLAYER_JOIN){
				_this.playerCount += 1;
				//if-else if-else block to check for starting game
				//call "callback" when its time to start
			} else if(pack.msgtype == MSG_TYPE_CONTROL_DATA){
				_this.controlHandler(pack);
			}
		}

		//temp code to make run
		var numPlayers = 2;
		this.playerCount = numPlayers;
		callback();
	}

	this.setFrameRate = function(num){
		frame_rate = num;
	}

	this.setControlHandler = function(f){
		this.controlHandler = f;
	}

	this.startGame = function(){
		//ensure lobbying has taken place
		if(!lobbyComplete){
			this.startLobby();
		}
		setupControls(this);
		var obj = this;
		setTimeout(function(){
			gameLoop(obj);
		}, 1000/frame_rate);
	}
}