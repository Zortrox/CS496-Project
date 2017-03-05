//Game API

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
function Game(minPlayers, maxPlayers){
	var minPlayers = minPlayers;
	var maxPlayers = maxPlayers;
	var htmlBod = document.getElementsByTagName("body")[0];
	var frame_rate = 33;
	var controlHandler = null;
	var active = true;
	this.playerCount = 0;
	this.params = {};
	this.canvs = [];
	this.htmlObjects = [];	//non-canvas HTML elements

	function receiveControls(){
		//TODO: Communicate with server to obtain controller input
		
		var controls = null;
		this.controlHandler(controls);
	}

	function gameRefresh(obj){
		for(canv in obj.canvs){
			obj.canvs[canv].updateCanvas();	
		}
	}

	function startLobby(){
		//TODO: do lobby stuff
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

	this.setFrameRate = function(num){
		frame_rate = num;
	}

	this.setControlHandler = function(f){
		this.controlHandler = f;
	}

	this.startGame = function(){
		startLobby();
		//Once lobby stuff is done:
		var obj = this;
		setTimeout(function(){
			gameLoop(obj);
		}, 1000/frame_rate);
	}
}