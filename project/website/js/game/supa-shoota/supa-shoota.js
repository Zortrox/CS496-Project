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
		_this.game = new Game(2,10);
		_this.game.addCanvas("defCanv", 600, 600, "border: 1px solid green; background: black;");
		_this.game.canvs["defCanv"].setBaseState();


		_this.addPlayer(TEAM_1);
		_this.addPlayer(TEAM_2);
		_this.addPlayer(TEAM_2);

		//Create our control handler
		_this.game.setControlHandler(function(controls){
			this.params[controls[0]] = controls[1];
		});

		_this.initControls();

		_this.game.startGame();
	};

	_this.initControls = function() {
		document.addEventListener('keydown', function(event) {
			//arrows + ctrl
			if(event.keyCode == 37) {
				_this.game.controlHandler(["p0_rot", -1]);
			}
			else if(event.keyCode == 38) {
				_this.game.controlHandler(["p0_move", 1]);
			}
			else if(event.keyCode == 39) {
				_this.game.controlHandler(["p0_rot", 1]);
			}
			else if(event.keyCode == 40) {
				_this.game.controlHandler(["p0_move", -1]);
			}
			else if(event.keyCode == 191) {
				_this.game.controlHandler(["p0_fire", true]);
			}

			//WASD + Q
			else if(event.key == "a") {
				_this.game.controlHandler(["p1_rot", -1]);
			}
			else if(event.key == "w") {
				_this.game.controlHandler(["p1_move", 1]);
			}
			else if(event.key == "d") {
				_this.game.controlHandler(["p1_rot", 1]);
			}
			else if(event.key == "s") {
				_this.game.controlHandler(["p1_move", -1]);
			}
			else if(event.key == "q") {
				_this.game.controlHandler(["p1_fire", true]);
			}

			//IJKL + U
			else if(event.key == "j") {
				_this.game.controlHandler(["p2_rot", -1]);
			}
			else if(event.key == "i") {
				_this.game.controlHandler(["p2_move", 1]);
			}
			else if(event.key == "l") {
				_this.game.controlHandler(["p2_rot", 1]);
			}
			else if(event.key == "k") {
				_this.game.controlHandler(["p2_move", -1]);
			}
			else if(event.key == "u") {
				_this.game.controlHandler(["p2_fire", true]);
			}
		});

		document.addEventListener('keyup', function(event) {
			//arrows
			if(event.keyCode == 37) {
				_this.game.controlHandler(["p0_rot", 0]);
			}
			else if(event.keyCode == 38) {
				_this.game.controlHandler(["p0_move", 0]);
			}
			else if(event.keyCode == 39) {
				_this.game.controlHandler(["p0_rot", 0]);
			}
			else if(event.keyCode == 40) {
				_this.game.controlHandler(["p0_move", 0]);
			}

			//WASD
			else if(event.key == "a") {
				_this.game.controlHandler(["p1_rot", 0]);
			}
			else if(event.key == "w") {
				_this.game.controlHandler(["p1_move", 0]);
			}
			else if(event.key == "d") {
				_this.game.controlHandler(["p1_rot", 0]);
			}
			else if(event.key == "s") {
				_this.game.controlHandler(["p1_move", 0]);
			}

			//IJKL
			else if(event.key == "j") {
				_this.game.controlHandler(["p2_rot", 0]);
			}
			else if(event.key == "i") {
				_this.game.controlHandler(["p2_move", 0]);
			}
			else if(event.key == "l") {
				_this.game.controlHandler(["p2_rot", 0]);
			}
			else if(event.key == "k") {
				_this.game.controlHandler(["p2_move", 0]);
			}
		});
	}

	_this.addPlayer = function(teamNum) {
		var strID = "p" + players.length;

		var player = new Player(teamNum);
		var pParams = {}
		pParams[strID + "_rot"] = 0;
		pParams[strID + "_move"] = 0;

		_this.game.canvs["defCanv"].addDynamicObject(strID, player.draw, pParams, player.update);
		players.push(player);


	}

	_this.init();
};

function Player(teamNum) {
	var _this = this;

	_this.x = 0;
	_this.y = 0;
	_this.dir = 0;
	_this.rad = 20;
	_this.speed = 2;
	_this.rotSpeed = 3;
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
		if (!_this.dead) {
			var rot = this.canv.game.params[this.id+"_rot"];
			var move = this.canv.game.params[this.id+"_move"];

			_this.dir += .02 * rot * _this.rotSpeed;
			_this.x += (Math.cos(_this.dir) * move) * _this.speed * (move < 0 ? .7 : 1);
			_this.y += (Math.sin(_this.dir) * move) * _this.speed * (move < 0 ? .7 : 1);

			var fire = this.canv.game.params[this.id+"_fire"];
			if (fire) {
				this.canv.game.params[this.id+"_fire"] = false;
				_this.fire(this.canv);
			}
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
		var tBullet = new Bullet(_this.teamNum, _this.x + Math.cos(_this.dir) * _this.rad, _this.y + Math.sin(_this.dir) * _this.rad, _this.dir);
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