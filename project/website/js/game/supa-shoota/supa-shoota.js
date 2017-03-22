function SupaShoota() {
	var _this = this;

	_this.canvas = null;
	_this.game = null;

	_this.init = function() {
		_this.game = new Game(2,10);
		_this.game.addCanvas("defCanv", 600, 600, "border: 1px solid green; background: black;");
		_this.game.canvs["defCanv"].setBaseState();

		var player = new Player();
		var pParams = {
			"p_xPos" : 0,
			"p_yPos" : 0,
			"p_vel" : 0
		}
		_this.game.canvs["defCanv"].addDynamicObject("p", player.draw, pParams, player.update);

		//Create our control handler
		_this.game.setControlHandler(function(controls){
			// the shape for this game's controls will be [x, y] where x = player 1's control, y = player 2's control
			this.params["p_vel"] = controls[0];
		});

		_this.game.startGame();
	};

	_this.init();
};

function Player() {
	var _this = this;

	_this.init = function() {
		
	};

	_this.draw = function() {
		var x = this.canv.game.params[this.id+"_xPos"];
		var y = this.canv.game.params[this.id+"_yPos"];
		this.canv.ctx.beginPath();
		this.canv.ctx.arc(x, y, 20, 0, Math.PI*2, false);
		this.canv.ctx.closePath();

		this.canv.ctx.fillStyle = "#F00";
		this.canv.ctx.fill();
		this.canv.ctx.strokeStyle = "#000";
		this.canv.ctx.stroke();
	};

	_this.update = function() {
		this.canv.game.params[this.id+"_yPos"] += 0.05;
	};

	_this.init();
}

window.onload = function(){
	var shoota = new SupaShoota();
}