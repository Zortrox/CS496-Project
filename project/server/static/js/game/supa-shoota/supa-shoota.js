const TEAM_1 = 1;
const TEAM_2 = 2;
const TEAM_3 = 3;

var players = [];
var friendlyFire = true;

function SupaShoota() {
	var _this = this;

	_this.canvas = null;
	_this.game = null;

	_this.init = function() {
		_this.game = new Game(1,2);
		_this.game.addCanvas("defCanv", 1280, 720, "border: 1px solid green; background: black; margin: 0 auto; display: block;");
		_this.canvas = _this.game.canvs["defCanv"].htmlCanv;
		_this.game.canvs["defCanv"].setBaseState();

		_this.setCanvasSize();
		$(window).on("resize", function() {
			_this.setCanvasSize();
		})

		//Create our control handler
		_this.game.setControlHandler(function(uuid, controls){
			//fire if right stick is moved enough
			if (controls["rightMag"] >= 50) {
				this.params["p-" + uuid + "_fire"] = true;
				this.params["p-" + uuid + "_dir"] = controls["rightAng"];
			} else {
				if (controls["rightMag"] >= 5) {
					this.params["p-" + uuid + "_dir"] = controls["rightAng"];
				}
				this.params["p-" + uuid + "_fire"] = false;
			}
			//update facing direction
			
			
			//movement
			this.params["p-" + uuid + "_speed"] = controls["leftMag"];
			if (controls["leftMag"] > 5) {
				//small buffer zone
				this.params["p-" + uuid + "_rot"] = controls["leftAng"];
			}

		});

		_this.game.startLobby(_this.initPreGame);
	};

	_this.setCanvasSize = function() {
		var width = $(_this.canvas).width();
	    var height = $(_this.canvas).height();
	    var maxWidth = $(window).width() - parseInt($("body").css("margin-left")) * 2 - 2;
	    var maxHeight = $(window).height() - parseInt($("body").css("margin-top")) * 2 - 2;

	    var ratio = maxWidth / width;
	    if (height * ratio > maxHeight) {
	        ratio = maxHeight / height;
	    }
	    $(_this.canvas).width(width * ratio);
	    $(_this.canvas).height(height * ratio);
	};

	_this.initPreGame = function() {
		for (var i = 0; i < _this.game.playerIDs.length; i++) {
			_this.addPlayer(_this.game.playerIDs[i], TEAM_1 + i);
		}

		_this.game.startGame();
	}

	_this.addPlayer = function(uuid, teamNum) {
		var strID = "p-" + uuid;

		var player = new Player(teamNum);
		var pParams = {}
		pParams[strID + "_rot"] = 0;	//movement rotation
		pParams[strID + "_speed"] = 0;	//movement speed
		pParams[strID + "_dir"] = 0;	//shooting (facing) direction
		pParams[strID + "_fire"] = 0;	//if shooting

		_this.game.canvs["defCanv"].addDynamicObject(strID, player.draw, pParams, player.update);
		players.push(player);
	}

	_this.init();
};

function Player(teamNum) {
	var _this = this;

	_this.x = 0;
	_this.y = 0;
	_this.rot = 0;
	_this.speed = 0;
	_this.dir = 0;
	_this.lastFire = 0;
	_this.rad = 20;
	_this.teamNum = 0;
	_this.color = "#F00";
	_this.bulletNum = 0;
	_this.maxHP = 100;
	_this.HP = _this.maxHP;
	_this.dead = false;

	_this.init = function(teamNum) {
		_this.teamNum = teamNum;

		if (teamNum == TEAM_1) {
			_this.color = "#F00";
		} else if (teamNum == TEAM_2) {
			_this.color = "#00F";
		} else {
			_this.color = "#0F0";
		}
	};

	_this.draw = function() {
		//circle
		this.canv.ctx.beginPath();
		this.canv.ctx.arc(_this.x, _this.y, _this.rad, 0, Math.PI*2, false);
		this.canv.ctx.closePath();

		this.canv.ctx.fillStyle = _this.color;
		this.canv.ctx.fill();
		this.canv.ctx.strokeStyle = "#000";
		this.canv.ctx.stroke();

		//direction line
		this.canv.ctx.beginPath();
		this.canv.ctx.moveTo(_this.x, _this.y);
		this.canv.ctx.lineTo(_this.x + Math.cos(_this.dir)*_this.rad, _this.y + Math.sin(_this.dir)*_this.rad);
		this.canv.ctx.closePath();

		this.canv.ctx.strokeStyle = "#000";
		this.canv.ctx.stroke();

		//hp bar
		this.canv.ctx.beginPath();
		this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 15), _this.rad * 2, 10);
		this.canv.ctx.closePath();
		this.canv.ctx.fillStyle = "#F00";
		this.canv.ctx.fill();

		var hpPerc = _this.HP / _this.maxHP;

		this.canv.ctx.beginPath();
		this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 15), _this.rad * 2 * hpPerc, 10);
		this.canv.ctx.closePath();

		this.canv.ctx.fillStyle = "#0F0";
		this.canv.ctx.fill();

		this.canv.ctx.beginPath();
		this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 15), _this.rad * 2, 10);
		this.canv.ctx.closePath();
		this.canv.ctx.strokeStyle = "#000";
		this.canv.ctx.stroke();
	};

	_this.update = function() {
		//rot, speed
		//dir, fire

		if (!_this.dead) {
			_this.dir = this.canv.game.params[this.id+"_dir"];	//shooting direction

			var fire = this.canv.game.params[this.id+"_fire"];

			if (fire) {
				var time = new Date().getTime();

				if (time - _this.lastFire > 100) {
					_this.fire(this.canv);
					_this.lastFire = new Date().getTime();
				}
			} else {
				_this.dir = this.canv.game.params[this.id+"_rot"];
			}

			_this.rot = this.canv.game.params[this.id+"_rot"];
			_this.speed = this.canv.game.params[this.id+"_speed"];

			//change speed based on facing/firing direction
			_this.speed *= 1.0 - 0.200794 * _this.dir - 4.36005 * Math.pow(_this.dir, 2) + 6.33598 * Math.pow(_this.dir, 3) - 2.27513 * Math.pow(_this.dir, 4);

			_this.x += Math.cos(_this.rot) * _this.speed / 50;
			_this.y += Math.sin(_this.rot) * _this.speed / 50;
		} else {
			this.expired = true;
		}
	};

	_this.getPos = function() {
		return {x: _this.x, y: _this.y};
	}

	_this.getTeamNum = function() {
		return teamNum;
	}

	_this.doDamage = function(amount, index) {
		_this.HP -= amount;

		if (_this.HP <= 0) {
			_this.dead = true;
			players.splice(index, 1);
		}
	}

	_this.fire = function(canvas) {
		var tBullet = new Bullet(_this.teamNum, _this.x + Math.cos(_this.dir) * _this.rad, _this.y + Math.sin(_this.dir)
			* _this.rad, _this.dir);
		canvas.addDynamicObject(this.id + "_bt_" + _this.bulletNum, tBullet.draw, {}, tBullet.update);
		_this.bulletNum++;
	}

	_this.init(teamNum);
}

function Bullet(teamNum, x, y, dir) {
	var _this = this;

	_this.x = 0;
	_this.y = 0;
	_this.dir = 0;
	_this.rad = 5;
	_this.speed = 10;
	_this.teamNum = 0;
	_this.color = "#FF0";

	_this.init = function(teamNum, x, y, dir) {
		_this.x = x;
		_this.y = y;
		_this.dir = dir;

		_this.teamNum = teamNum;

		if (teamNum == TEAM_1) {
			_this.color = "#F55";
		} else if (teamNum == TEAM_2) {
			_this.color = "#77F";
		} else {
			_this.color = "#5F5";
		}
	};

	_this.draw = function() {
		//circle
		this.canv.ctx.beginPath();
		this.canv.ctx.arc(_this.x, _this.y, _this.rad, 0, Math.PI*2, false);
		this.canv.ctx.closePath();

		this.canv.ctx.fillStyle = _this.color;
		this.canv.ctx.fill();
	};

	_this.update = function() {
		_this.x += Math.cos(_this.dir) * _this.speed;
		_this.y += Math.sin(_this.dir) * _this.speed;

		if (_this.x < -10 || _this.y < -10 || _this.x > this.canv.htmlCanv.width + 10 || _this.y > this.canv.htmlCanv.height + 10) {
			this.expired = true;
		} else {
			_this.contact(this);
		}
	};

	_this.contact = function(gameObj) {
		for (var i = players.length - 1; i >= 0; i--) {
			var pos = players[i].getPos();

			var dx = pos.x - _this.x;
			var dy = pos.y - _this.y;
			var dist = Math.sqrt(dx * dx + dy * dy);

			//bullet hit player
			if (dist < 20) {
				if (_this.teamNum != players[i].getTeamNum() || friendlyFire) {
					players[i].doDamage(10, i);
				}
				gameObj.expired = true;
				break;
			}
		}
	}

	_this.init(teamNum, x, y, dir);
}

window.onload = function(){
	var shoota = new SupaShoota();
}