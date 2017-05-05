function Vector(i,j,k){
    this.i = i || 0;
    this.j = j || 0;
    this.k = k || 0;

    this.dot = vector=> {
        return this.i * vector.i + this.j * vector.j + this.k * vector.k;
    }

    this.getPerp = ()=>{
        return new Vector(this.j,-this.i);
    }

    this.mag = () =>{
        return Math.sqrt(  Math.pow(this.i,2) + Math.pow(this.j,2)+ Math.pow(this.k,2))
    }

    this.unit = ()=>{
        var magnitude = this.mag();
        return new Vector(this.i/magnitude, this.j/magnitude, this.k/magnitude);
    }

    this.projectOnTo = (vector)=> {
        return (this.dot(vector))/(vector.mag())
    }

    this.rotate = angle=>{

            var i = this.i;
            var j = this.j;
            this.i = i * Math.cos(angle) - j * Math.sin(angle);
            this.j = i * Math.sin(angle) + j * Math.cos(angle);
    }

    this.add = vector=>{return new Vector(this.i+vector.i,this.j+vector.j,this.k+vector.k)}

    this.sub = vector=>{return new Vector(this.i-vector.i,this.j-vector.j,this.k-vector.k)}

    this.scale =  vector => {
        this.i *= vector.i;
        this.j *= vector.j;
        this.k *= vector.k;
    }


    this.clone = () => {return new Vector(this.i,this.j,this.k)}





}

function Shape(positionVector, arrayOfEdges ){


    this.pos = positionVector || new Vector();
    this.angle = 0;
    this.scaleFactor = new Vector(1,1,1);
    this.orginalEdges = arrayOfEdges || [];
    this.edges = arrayOfEdges || [];

    this.clone = () => {

        var clonedEdges = [];

        for(var i=0;i<this.orginalEdges.length;i++){
            clonedEdges.push(this.orginalEdges[i].clone())
        }

        var shape = new Shape(this.pos.clone(),clonedEdges);
        shape.angle = this.angle;
        shape.scaleFactor = this.scaleFactor;
        shape.recalc();
        return shape;

    }


    this.recalc = ()=>{

        var i;
        var len = this.orginalEdges.length;
        this.edges = []

        for (i = 0; i < len; i++) {
            this.edges[i] = this.orginalEdges[i].clone();
            this.edges[i].scale(this.scaleFactor);

            if(this.angle !== 0) {
                this.edges[i].rotate(this.angle);
            }
        }

    }

    this.setScaleFactor = scaleVector => {
        this.scaleFactor = scaleVector;
        this.recalc();
    }

    this.setScaleFactorXYZ = (x,y,z) => {
        this.scaleFactor = new Vector(x,y,z);
        this.recalc();
    }

    this.setPos = posVector => {
        this.pos = posVector;
        this.recalc();
    }

    this.setPosXYZ = (x,y,z) =>{
        this.pos = new Vector(x,y,z)
        this.recalc();
    }

    this.setAngle = angle => {
        this.angle = angle;
        this.recalc();
    }


    this.getAxes = () =>{
        axes = [];
        for(var i = 0 ; i< this.orginalEdges.length;i++){
            axes.push(this.orginalEdges[i].getPerp())
        }
        return axes;
    }

    this.getPoints = () =>{

        var points = [];

        var x = this.pos.i;
        var y = this.pos.j;

        for(var i = 0;i<this.edges.length;i++){
            points.push(new Vector(x,y));
            x += this.edges[i].i;
            y += this.edges[i].j;
        }
        return points;
    };

    this.draw = (ctx ,color) => {

        ctx.beginPath();
        ctx.fillStyle =  color || "black";
        var x = this.pos.i;
        var y = this.pos.j;
        ctx.moveTo(x,y);
        //console.log(this.orginalEdges)

        for(var i = 0;i<this.edges.length;i++){

            //console.log(y)

            x += this.edges[i].i;
            y += this.edges[i].j;

            ctx.lineTo(x,y);


        }

        ctx.closePath();
        ctx.fill();



    }




    this.recalc();


}

Shape.rect = function (x1,y1,x2,y2) {
    var sides = [];
    sides.push(new Vector(0, 1));
    sides.push(new Vector(1, 0));
    sides.push(new Vector(0, -1));
    sides.push(new Vector(-1, 0));

    var shape = new Shape(new Vector(x1, y1), sides)
    shape.setScaleFactor(new Vector(x2, y2))

    return shape;

}


    function flattenPointsOn(points, normal) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++ ) {

        var dot = points[i].dot(normal);
        if (dot < min) { min = dot; }
        if (dot > max) { max = dot; }
    }
    return {min:min,max:max}
}

function isSeparatingAxisCollision(aShape,bShape) {

    var aPoints =  aShape.getPoints();
    var bPoints =  bShape.getPoints();
    var axesA = aShape.getAxes();
    var axesB = bShape.getAxes();

    var i = 0;
    for(var i =0;i<axesA.length;i++) {
        var axis = axesA[i]

        var offsetV = aShape.pos.sub(bShape.pos)
        var projectedOffset = offsetV.dot(axis);

        var rangeA = flattenPointsOn(aPoints, axis)
        var rangeB = flattenPointsOn(bPoints, axis)
        //console.log(rangeA);console.log(rangeB);
        //console.log("===")
        //rangeB.min += projectedOffset;
        //rangeB.max += projectedOffset;

        if (rangeA.min > rangeB.max || rangeB.min > rangeA.max) {
            return false;
        }
    }

    for(var i =0;i<axesB.length;i++) {
        var axis = axesB[i]

        var offsetV = aShape.pos.sub(bShape.pos)
        var projectedOffset = offsetV.dot(axis);

        var rangeA = flattenPointsOn(aPoints, axis)
        var rangeB = flattenPointsOn(bPoints, axis)

       // rangeB.min += projectedOffset;
       // rangeB.max += projectedOffset;

        if (rangeA.min > rangeB.max || rangeB.min > rangeA.max) {
            return false;
        }
    }

    return true;
}




function rollNRockRacing() {


    //What Resolution the game renders at
    var width = '1600';
    var height = '900';

    //Create a new instance of a game object
	var game = new Game(1,20);
	var canvasStyle = `
	    position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;

	//Sending the canvas element to the game engine
	var canv = game.addCanvas("game-canvas",width,height, canvasStyle);
    // Object that represents a single display region
	var canvObject = game.canvs["game-canvas"];

	// The actual canvas element
    var canv = document.getElementById('game-canvas'); // This will be removed when connor changes API

    var grass = [];

    var ctx = canv.getContext('2d'); // Set the Canvas into Canvas mode

    generateBackground(); // These are the instructions to generate the background

    this.players = [];
    var players = this.players;


    game.controlHandler = (uuid , data)=> {
        console.log("Received Input:");
        console.log(data);
        this.players[game.playerIDs[i]].input = data;
    }



    game.startLobby(()=> {
        var players = this.players;


        for(var i = 0; i<game.playerIDs.length;i++){
            console.log("Adding Player")
            players[game.playerIDs[i]] = new Player(120,500,getRandomColor(),grass);
            canvObject.addDynamicObject(players[game.playerIDs[i]].id,players[game.playerIDs[i]].draw,null,players[game.playerIDs[i]].update)

        }

        console.log("Done Adding Player")


        game.controlHandler = (uuid , data)=> {
            console.log("Received Input:");
            console.log(data);
            this.players[uuid].input = data;
        }
        game.startGame()
    });



    resizeCanvas(); // Resize Canvas to the user screen
    document.body.onresize = ()=> resizeCanvas(); // Resize Canvas anytime the user's screen changes size







    // var RoomJoinHTML =  document.createElement("h4");
    // RoomJoinHTML.innerText= "Room Join Code: "+getParameterByName("r"); // Dont use Inner HTML, XSS
    // game.addHTMLObject(RoomJoinHTML);



    function generateBackground() {


        //Clear with BLACK for roads
        ctx.beginPath();
        ctx.rect(0, 0, 1600, 900);
        ctx.fillStyle = 'black';
        ctx.fill();

        // var sides = [];
        // sides.push(new Vector(0,1));
        // sides.push(new Vector(1,0));
        // sides.push(new Vector(0,-1));
        // sides.push(new Vector(-1,0));
        //
        // r1 = new Shape(new Vector(150,100),sides);
        // r1.setScaleFactorXYZ(100,100);
        // r1.draw(ctx,"red");
        //
        // r2 = r1.clone();
        // r2.setPosXYZ(100,201)
        // r2.setAngle(-0.2)
        // r2.draw(ctx,"blue")
        //
        // console.log(isSeparatingAxisCollision(r1,r2))






        var tmpGrass = Shape.rect(0,0,100,900);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);


        tmpGrass = Shape.rect(0,900, 1600, -100)
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);


        //Right Grass
        tmpGrass = Shape.rect(1600,900, -100, -900);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);

        //Top Grass
        tmpGrass = Shape.rect(0,0, 1600, 100);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);

        //Left Grass Obstacle
        tmpGrass = Shape.rect(200,200, 100, 500);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);

        //Bottom Grass Obstacle
        tmpGrass = Shape.rect(400,700, 800, 100);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);


        //Right Grass Obstacle
        tmpGrass = Shape.rect(1300,700, 100, -500);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);

        //middle  Grass Obstacle
        tmpGrass = Shape.rect(300,600, 1000, -200);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);

        //Bottom Grass Obstacle
        tmpGrass = Shape.rect(400,100, 800, 200);
        tmpGrass.draw(ctx,'green')
        grass.push(tmpGrass);

        //Finish Line
        ctx.beginPath();
        ctx.rect(100,500, 100, 10);
        ctx.fillStyle = 'white';
        ctx.fill();

        canvObject.setBaseState();


    }

    function Player(x,y,color,collisionShapes) {
        this.pos_x = x;
        this.pos_y = y;
        this.size_x = 20;
        this.size_y = 10;

        this.collisionShapes = collisionShapes;

        this.shape = Shape.rect(x,y,this.size_x,this.size_x)

        this.color = color;

        this.velo_x=0;
        this.velo_y=0;
        this.velo_both = 0;

        this.rotation = Math.PI/2;

        this.friction=0;

        this.id = "game-canvas";
        //this.params = params; //params should be a list of ids that correspond to the game's parameter id list
        this.canv = canv;

        this.input = {};



        //Instructions to draw the player
        this.draw = ()=>{
            ctx.save();



            ctx.translate(this.pos_x,this.pos_y)
            ctx.rotate(this.rotation);
            //ctx.translate((this.pos_x + (this.size_x/2)),(this.pos_y + (this.size_y/2)))

            ctx.beginPath();
            ctx.rect(-this.size_x/2, -this.size_y/2, this.size_x, this.size_y);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        };

        //Function to update position/parameters of object
        //Note: This function is called every frame
        this.update = ()=>{

            if(this.input.left === 1){
                this.rotation =  this.rotation - 0.13;
            }
            if(this.input.right === 1){
                this.rotation =  this.rotation + 0.13;
            }

            if(this.input.a === 1){
                //this.velo_x = this.velo_x + Math.cos(this.rotation);
                //this.velo_y = this.velo_y + Math.sin(this.rotation);
                this.velo_both = this.velo_both + 0.5;
            }

            if(this.input.b === 1){
                // this.pos_x = this.pos_x - Math.cos(this.rotation);
                // this.pos_y = this.pos_y - Math.sin(this.rotation);
                this.velo_both = this.velo_both - 0.5;
            }

            this.pos_x = this.velo_both*(Math.cos(this.rotation)) + this.pos_x
            this.pos_y = this.velo_both*(Math.sin(this.rotation)) + this.pos_y
            this.shape.setPosXYZ(this.pos_x,this.pos_y)
            //console.log(this.shape)

            if(this.velo_both > 0){
                this.velo_both = this.velo_both - 0.2;
            }
            if(this.velo_both > 10){
                this.velo_both = 10;
            }

            for(var i = 0;i<this.collisionShapes.length;i++){
                if(this.velo_both > 3 && isSeparatingAxisCollision(this.shape,this.collisionShapes[i])){
                    this.velo_both = 2;
                    break;
                }
            }


            if(this.velo_both < 0){
                this.velo_both = 0
            }










        };




        this.expired = false; //set expired to true when object is ready to be deleted




    }



    //This function resizes the canvas and maintains the aspect ratio (Hard Coded 16:9)
    function resizeCanvas() {
        var w = window.innerWidth;
        var h = window.innerHeight;

        if(w*0.5625>h){
            canv.style.height = h
            canv.style.width = h*1.77777778
        }else{
            canv.style.height = w*0.5625;
            canv.style.width = w
        }
    }



};


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


window.onload = function(){
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';

    var game = new rollNRockRacing();



/*
	//Control Handler
    let controller = {'a': 0,
        "b" : 0,
        "up": 0,
        "down": 0,
        "left": 0,k,
        "right": 0};

    game.players['player1'].input = controller;

    window.onkeydown = e=>{
        switch (e.keyCode){
            case 38:
                controller.up = 1;
                break;
            case 40:
                controller.down = 1;
                break;
            case 39:
                controller.right = 1;
                break;
            case 37:
                 controller.left = 1;
                 break;
            case 90:
                controller.a = 1;
                break;
            case 88:
                controller.b = 1;
                break;
        }

    }

    window.onkeyup = e=>{
        switch (e.keyCode){
            case 38:
                controller.up = 0;
                break;
            case 40:
                controller.down = 0;
                break;
            case 39:
                controller.right = 0;
                break;
            case 37:
                controller.left = 0;
                break;
            case 90:
                controller.a = 0;
                break;
            case 88:
                controller.b = 0;
                break;
        }
        //Send Controller to Game

    }
*/
}



