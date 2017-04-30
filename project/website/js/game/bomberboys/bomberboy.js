function setup(){
	var game = new Game(2,4);

	//TODO:choose between different boards randomly
	var boardMat = readBoard(board1);

	//TODO: calculate square size based on screen
	var sqsize = 5;

	game.addCanvas("board", window.innerWidth, window.innerHeight, "border: 1px solid black");

	drawStaticBoard(boardMat, game.canvs["board"], sqsize);
	game.canvs["board"].setBaseState();
	game.canvs["board"].addDynamicObject("tempBoard",function(){
		//draw function
		game.canvs["board"].ctx.beginPath();
		for(var i = 0; i < board.length; i++){
			for(var j = 0; j < board[i].length; j++){
				if(board[i][j] == 2){
					game.canvs["board"].ctx.rect(sqsize*j,sqsize*i,sqsize,sqsize);
					game.canvs["board"].ctx.fillStyle = "#A0522D";
					game.canvs["board"].ctx.fill();
					game.canvs["board"].ctx.stroke();
				}
			}
		}
		game.canvs["board"].ctx.closePath();
	},{},function(){
		//update function
		
	})
}

function readBoard(var b){
	var splitB = b.split(",");
	for(var i = 0; i < splitB.size(); i++){
		splitB[i] = splitB[i].split('');
	}
	return splitB;
}

function drawStaticBoard(board, canv, sqsize){
	canv.ctx.beginPath();
	for(var i = 0; i < board.length; i++){
		for(var j = 0; j <board[i].length; j++){
			if(board[i][j] == 1){
				canv.ctx.rect(sqsize*j,sqsizez*i,sqsize,sqsize);
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
111111111111111111111111111111111111111111111111111111111111111111111,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
121202120212021202120212021202120212021202120212021202120212021202121,
120212021202120212021202120212021202120212021202120212021202120212021,
111111111111111111111111111111111111111111111111111111111111111111111

`