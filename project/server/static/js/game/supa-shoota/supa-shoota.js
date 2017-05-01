const TEAM_1 = 1;
const TEAM_2 = 2;
const TEAM_3 = 3;
const TEAM_4 = 4;
const TEAM_5 = 5;
const TEAM_6 = 6;
const TEAM_7 = 7;
const TEAM_8 = 8;

const pColors = [
	"#ff0000",
	"#00ffff",
	"#00ff00",
	"#0000ff",
	"#ff7373",
	"#ffd700",
	"#ffa500",
	"#f6546a",
];

const bColors = [
	"#ff0000",
	"#00ffff",
	"#00ff00",
	"#0000ff",
	"#ff7373",
	"#ffd700",
	"#ffa500",
	"#f6546a",
];

var players = [];
var numPlayers;
var bGameWon = false;
var gamesPlayed = 0;
var blocks = [];
var friendlyFire = true;
var teamWon = 0;
var winHP = 0;
var winSpeed = 1;
var winReload = 0;

var gameWidth = 1280;
var gameHeight = 720;

function SupaShoota() {
	var _this = this;

	_this.canvas = null;
	_this.game = null;

	_this.init = function() {
		_this.game = new Game(2,8);
		_this.game.addCanvas("defCanv", gameWidth, gameHeight, "border: 1px solid green; background: black; margin: 0 auto; display: block;");
		_this.canvas = _this.game.canvs["defCanv"].htmlCanv;

		//draw some random blocks
		for (var i = 0; i < 10; i++) {
			var width = Math.floor(Math.random() * (250 - 50 + 1) + 50);
			var height = Math.floor(Math.random() * (250 - 50 + 1) + 50);
			var x = Math.floor(Math.random() * (gameWidth - width - 0) + 0);
			var y = Math.floor(Math.random() * (gameHeight - height - 0) + 0);
			var block = new Block(x, y, width, height);
			block.draw(_this.game.canvs["defCanv"].ctx)
			blocks.push(block);
		}

		//draw collision border around area

		_this.game.canvs["defCanv"].setBaseState();

		_this.setCanvasSize();
		$(window).on("resize", function() {
			_this.setCanvasSize();
		})

		//Create our control handler
		_this.game.setControlHandler(function(uuid, controls){
			//fire if right stick is moved enough
			if (controls["rightMag"] >= 25) {
				this.params["p-" + uuid + "_fire"] = true;
				this.params["p-" + uuid + "_aiming"] = true;
				this.params["p-" + uuid + "_dir"] = controls["rightAng"];
			} else {
				if (controls["rightMag"] >= 2) {
					this.params["p-" + uuid + "_aiming"] = true;
					this.params["p-" + uuid + "_dir"] = controls["rightAng"];
				} else {
					this.params["p-" + uuid + "_aiming"] = false;
				}
				this.params["p-" + uuid + "_fire"] = false;
			}
			//update facing direction
			
			
			//movement
			this.params["p-" + uuid + "_speed"] = controls["leftMag"];
			if (controls["leftMag"] > 2) {
				//small buffer zone
				this.params["p-" + uuid + "_rot"] = controls["leftAng"];
			}

		});

		jQuery(_this.canvas).on("click", function() {
			bGameWon = false;
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

	_this.initPreGame = function(firstGame) {
		if (typeof(firstGame)==='undefined') firstGame = true;

		players = [];
		numPlayers = _this.game.playerIDs.length;
		bGameWon = false;

		for (var i = 0; i < numPlayers; i++) {
			_this.addPlayer(_this.game.playerIDs[i], TEAM_1 + i);
		}

		var sm = new ScoreManager(_this.initPreGame);
		_this.game.canvs["defCanv"].addDynamicObject("sm" + gamesPlayed, sm.draw, {}, sm.update);
		gamesPlayed++;

		if (firstGame) {
			_this.game.startGame();
		}
	}

	_this.addPlayer = function(uuid, teamNum) {
		var strID = "p-" + uuid;

		var rad = 20;
		var x;
		var y;
		var facing = Math.random() * 2 * Math.PI;

		bCollision = true;
		while (bCollision) {
			x = Math.floor(Math.random() * ((gameWidth - rad) - (0+rad)) + 0 + rad);
			y = Math.floor(Math.random() * ((gameHeight - rad) - (0+rad)) + 0 + rad);

			bCollision = false;
			for (var i = blocks.length - 1; i >= 0; i--) {
				if (blocks[i].contact(x, y, rad)) {
					bCollision = true;
				}
			}
		}

		var hp = 0;
		if (teamNum == teamWon) {
			hp = winHP;
		}

		var player = new Player(x, y, facing, teamNum, winHP);
		var pParams = {}
		pParams[strID + "_rot"] = 0;	//movement rotation
		pParams[strID + "_speed"] = 0;	//movement speed
		pParams[strID + "_dir"] = 0;	//shooting (facing) direction
		pParams[strID + "_fire"] = false;	//if shooting
		pParams[strID + "_aiming"] = false;	//if aiming the gun

		_this.game.canvs["defCanv"].addDynamicObject(strID, player.draw, pParams, player.update);
		players.push(player);
	}

	_this.init();
};

function ScoreManager(gameWonFunc) {
	var _this = this;
	_this.gameWon = false;
	_this.oldTeamWon = teamWon;

	_this.restart = function() {
		gameWonFunc(false);
	}

	_this.update = function() {
		//reset the game
		if (bGameWon) {
			_this.gameWon = true;
		} else if (_this.gameWon) {
			this.expired = true;

			if (_this.oldTeamWon == teamWon) {
				winHP += 25;
				winSpeed += 0.2;
				winReload += 250;
			} else {
				winHP = 0;
				winSpeed = 1;
				winReload = 0;
			}

			setTimeout(_this.restart, 0)
		} else {
			if (numPlayers == 1) {
				bGameWon = true;
			}
		}
	}

	_this.draw = function() {
		if (bGameWon) {
			//draw "winner"
			this.canv.ctx.font = "bold 70pt Calibri";
			this.canv.ctx.textAlign = "center";
			this.canv.ctx.fillStyle = "rgba(50, 255, 50, .8)";
			this.canv.ctx.fillText("WINNER", gameWidth / 2, gameHeight / 2);

			this.canv.ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
			this.canv.ctx.strokeText("WINNER", gameWidth / 2, gameHeight / 2);
		}
	}
}

function Player(x, y, facing, teamNum) {
	var _this = this;

	_this.x = 0;
	_this.y = 0;
	_this.rot = 0;
	_this.speed = 0;
	_this.speedMult = 1;
	_this.dir = 0;
	_this.lastFire = 0;
	_this.fireTime = 200;
	_this.maxBullets = 20;
	_this.bullets = _this.maxBullets;
	_this.lastReload = 0;
	_this.reloadTime = 3000;
	_this.bReloading = false;
	_this.rad = 20;
	_this.teamNum = 0;
	_this.bulletNum = 0;
	_this.maxHP = 100;
	_this.HP = _this.maxHP;
	_this.dead = false;

	_this.color = "#F00";
	_this.colorHP = "#0F0";
	_this.colorBorder = "#000";

	_this.init = function(x, y, facing, teamNum) {
		_this.x = x;
		_this.y = y;
		_this.dir = facing;
		_this.teamNum = teamNum;

		if (teamNum == teamWon) {
			_this.maxHP += winHP;
			_this.HP += winHP;

			_this.reloadTime -= winReload;
			if (_this.reloadTime < 0) {
				_this.reloadTime = 0;
			}

			_this.speedMult = winSpeed;

			_this.colorHP = "#ffd416";
			_this.colorBorder = "#826a01";
		}

		_this.color = pColors[teamNum - 1];
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
		this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 20), _this.rad * 2, 10);
		this.canv.ctx.closePath();
		this.canv.ctx.fillStyle = "#F00";
		this.canv.ctx.fill();

		var hpPerc = _this.HP / _this.maxHP;

		this.canv.ctx.beginPath();
		this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 20), _this.rad * 2 * hpPerc, 10);
		this.canv.ctx.closePath();

		this.canv.ctx.fillStyle = _this.colorHP;
		this.canv.ctx.fill();

		this.canv.ctx.beginPath();
		this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 20), _this.rad * 2, 10);
		this.canv.ctx.closePath();
		this.canv.ctx.strokeStyle = _this.colorBorder;
		this.canv.ctx.stroke();

		//reload time
		if (_this.bReloading) {
			var time = new Date().getTime();
			var bulletsPerc = (time - _this.lastReload) / _this.reloadTime;

			this.canv.ctx.beginPath();
			this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 8), _this.rad * 2 * bulletsPerc, 5);
			this.canv.ctx.closePath();

			this.canv.ctx.fillStyle = "#d6c484";
			this.canv.ctx.fill();

			this.canv.ctx.beginPath();
			this.canv.ctx.rect(_this.x - _this.rad, _this.y - (_this.rad + 8), _this.rad * 2, 5);
			this.canv.ctx.closePath();
			this.canv.ctx.strokeStyle = "#000";
			this.canv.ctx.stroke();
		}
	};

	_this.update = function() {
		//rot, speed
		//dir, fire

		if (!bGameWon) {
			if (!_this.dead) {
				_this.dir = this.canv.game.params[this.id+"_dir"];	//shooting direction

				var fire = this.canv.game.params[this.id+"_fire"];

				if (fire && _this.bullets > 0) {
					var time = new Date().getTime();

					if (time - _this.lastFire > _this.fireTime) {
						_this.fire(this.canv);
						_this.bullets--;
						_this.lastFire = new Date().getTime();

						if (_this.bullets == 0) {
							_this.bReloading = true;
							_this.lastReload = new Date().getTime();
						}
					}
				//update to movement direction if not shooting or aiming
				} else if (!this.canv.game.params[this.id+"_aiming"]) {
					_this.dir = this.canv.game.params[this.id+"_rot"];
				}

				if (_this.bReloading == true) {
					var time = new Date().getTime();

					if (time - _this.lastReload > _this.reloadTime) {
						_this.bReloading = false;
						_this.bullets = _this.maxBullets
					}
				}

				_this.rot = this.canv.game.params[this.id+"_rot"];
				_this.speed = this.canv.game.params[this.id+"_speed"];

				//collision with blocks
				var bXHit = false;
				var bYHit = false;
				var nextX = _this.x + Math.cos(_this.rot) * (_this.speed) * _this.speedMult / 25;
				var nextY = _this.y + Math.sin(_this.rot) * (_this.speed) * _this.speedMult / 25;
				for (var i = blocks.length - 1; i >= 0; i--) {
					if (blocks[i].contact(nextX, _this.y, _this.rad)) {
						bXHit = true;
					}
					if (blocks[i].contact(_this.x, nextY, _this.rad)) {
						bYHit = true;
					}
				}

				//collision with outside area
				if (nextX - _this.rad <= 0 || nextX + _this.rad >= gameWidth) {
					bXHit = true;
				}
				if (nextY - _this.rad <= 0 || nextY + _this.rad >= gameHeight) {
					bYHit = true;
				}

				if (!bXHit) _this.x = nextX;
				if (!bYHit) _this.y = nextY;
			} else {
				this.expired = true;
			}
		} else {
			_this.dead = true;
			teamWon = _this.teamNum;
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

		if (_this.HP <= 0 && !_this.dead) {
			_this.dead = true;
			numPlayers--;
			players.splice(index, 1);
		}
	}

	_this.fire = function(canvas) {
		var tBullet = new Bullet(_this.teamNum, _this.x + Math.cos(_this.dir) * _this.rad, _this.y + Math.sin(_this.dir)
			* _this.rad, _this.dir);
		canvas.addDynamicObject(this.id + "_bt_" + _this.bulletNum, tBullet.draw, {}, tBullet.update);
		_this.bulletNum++;
	}

	_this.init(x, y, facing, teamNum);
}

function Bullet(teamNum, x, y, dir) {
	var _this = this;

	_this.x = 0;
	_this.y = 0;
	_this.dir = 0;
	_this.rad = 4;
	_this.speed = 10;
	_this.teamNum = 0;
	_this.color = "#FF0";
	_this.dead = false;

	_this.init = function(teamNum, x, y, dir) {
		_this.x = x;
		_this.y = y;
		_this.dir = dir;

		_this.teamNum = teamNum;

		_this.color = _this.shadeBlend(0.8, pColors[teamNum - 1]);
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
		if (!bGameWon) {
			if (!_this.dead) {
				_this.x += Math.cos(_this.dir) * _this.speed;
				_this.y += Math.sin(_this.dir) * _this.speed;

				if (_this.x < -10 || _this.y < -10 || _this.x > gameWidth + 10 || _this.y > gameHeight + 10) {
					this.expired = true;
				} else {
					_this.contact(this);
				}
			} else {
				this.expired = true;
			}
		} else {
			_this.dead = true;
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

		if (gameObj.expired == false) {
			for (var i = blocks.length - 1; i >= 0; i--) {
				if (blocks[i].contact(_this.x, _this.y, _this.rad)) {
					gameObj.expired = true;
					break;
				}
			}
		}
	}

	_this.shadeBlend = function(p,c0,c1) {
		var n=p<0?p*-1:p,u=Math.round,w=parseInt;
		if(c0.length>7){
			var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
			return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
		}else{
			var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
			return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
		}
	}

	_this.init(teamNum, x, y, dir);
}

function Block(x, y, width, height) {
	var _this = this;

	_this.x = 0;
	_this.y = 0;
	_this.width = 0;
	_this.height = 0;
	_this.color = "#CCC";

	_this.init = function(x, y, width, height) {
		_this.x = x;
		_this.y = y;
		_this.width = width;
		_this.height = height;
	};

	_this.draw = function(ctx) {
		//circle
		ctx.beginPath();
		ctx.rect(_this.x, _this.y, _this.width, _this.height);
		ctx.closePath();

		ctx.fillStyle = _this.color;
		ctx.fill();
	};

	_this.contact = function(x, y, rad) {
		if (x + rad >= _this.x && x - rad <= _this.x + _this.width &&
			y + rad >= _this.y && y - rad <= _this.y + _this.height) {
			return true;
		}
		return false;
	}

	_this.init(x, y, width, height);
}

window.onload = function(){
	var shoota = new SupaShoota();
}