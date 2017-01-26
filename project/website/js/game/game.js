//Game API

function DynamicObject(drawFunction, canv, params){
	//params should be a list of ids that correspond to the game's parameter id list
	this.params = params;
	this.canv = canv;
	this.draw = drawFunction;
}

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
}

function Game(id){
	this.id = id;
	this.params = [];
	this.canvs = [];
	this.htmlObjects = [];	//non-canvas HTML elements
	this.players = [];
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
}
