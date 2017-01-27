//Game API

//-------------------------------------------------------------------------------------

//DynamicObject
//Object that represents a single moving/dynamic sprite
function DynamicObject(drawFunction, canv, params){
	this.params = params; //params should be a list of ids that correspond to the game's parameter id list
	this.canv = canv;
	this.draw = drawFunction;
	this.expired = false; //set expired to true when object is ready to be deleted
}

//-------------------------------------------------------------------------------------

//Canvas Object
//Object that represents a single display region
function Canvas(canv, game){
	this.canv = canv;
	this.game = game;
	this.canv.ctx = this.canv.getContext("2d");
	this.dynamicObjects = [];

	this.setBaseState = function(){
		this.baseState = this.ctx.getImageData(0, 0, this.canv.width, this.canv.height);
	}

	this.addGameObject = function(obj){
		this.dynamicObjects.push(obj);
	}

	this.updateCanvas = function(){
		this.resetToBaseState();
		this.drawObjects();
	}

	this.resetToBaseState = function(){
		this.canv.ctx.putImageData(this.baseState, 0, 0);
	}

	this.drawObjects = function(){
		var i = 0;
		var boundary = this.dynamicObjects.length;
		while(i < boundary){
			if(this.dynamicObjects[i].expired){
				this.dynamicObjects.splice(i,1);
				boundary--;
			} else {
				this.dynamicObjects[i].draw();
				i++;
			}
		}
	}
}

//-------------------------------------------------------------------------------------

//Game Object
//Master object (singleton design model?) for a unique game instance
function Game(id){
	this.id = id;
	this.params = {};
	this.canvs = [];
	this.htmlObjects = [];	//non-canvas HTML elements
	this.frame_rate = 10;
	this.active = true;
	//this.players = [];
	this.htmlBod = document.getElementsByTagName("body")[0];
	
	//all HTML element insertions (Canvas or other) insert the new element as the first element in body
	//canvas is created using given style specs
	this.addCanvas = function(canvID,canvWidth,canvHeight,canvStyle){
		var canv = document.createElement("canvas");
		canv.id = canvID;
		canv.width = canvWidth;
		canv.height = canvHeight;
		canv.style = canvStyle;
		this.canvs[""+canvID] = new Canvas(canv, this);
		this.htmlBod.insertBefore(canv, this.htmlBod.firstChild);
	}
	
	this.addHTMLObject = function(obj,objID){
		document.getElementsByTagName("body")[0].insertBefore(obj,this.htmlBod.firstChild);
		this.htmlObjects[""+objID] = obj;
	}

	this.addParam = function(id, defValue){
		this.params[""+id] = defValue;
	}

	this.setFrameRate(num){
		this.frame_rate = num;
	}

	this.updateParams = function(){
		//TODO: Communicate with server to obtain updated values of all params
	}

	this.gameRefresh = function(){
		for(canv in canvs){
			canv.updateCanvas();
		}
	}

	this.startGame = function(){
		var obj = this;
		setTimeout(function(){
			obj.gameLoop(obj);
		}, obj.frame_rate);
	}

	this.gameLoop = function(obj){
		if(obj.active){
			obj.updateParams();
			obj.gameRefresh();
			setTimeout(function(){
				obj.update(obj);
			}, obj.frame_rate);
		}
	}
}