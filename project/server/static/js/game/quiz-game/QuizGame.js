var players = [];

var questions = [
        [   "In the year 1900 in the U.S. what were the most popular first names given to boy and girl babies?",
            "William and Elizabeth",
            "Joseph and Catherine",
            "John and Mary",
            "George and Anne",
            3
        ],

        [   "Which of the following items was owned by the fewest U.S. homes in 1990?",
            "home computer",
            "compact disk player",
            "cordless phone",
            "dishwasher",
            2
        ],

        [   "During the 1980s for six consecutive years what breed of dog was the most popular in the U.S.?",
            "cocker spaniel",
            "German shepherd",
            "Labrador retriever",
            "poodle",
            1
        ],

        [   "In J. Edgar Hoover, what did the J stand for?",
            "James",
            "John",
            "Joseph",
            "Jasper",
            2
        ]
    ];

var questionIndex = 0;

//get a new random question and update the params in game
function newQuestion(){
    var questionIndex = Math.floor(Math.random() * questions.length);

    document.getElementById("Q").innerHTML = questions[questionIndex][0]; 
    document.getElementById("A").innerHTML = questions[questionIndex][1]; 
    document.getElementById("B").innerHTML = questions[questionIndex][2]; 
    document.getElementById("C").innerHTML = questions[questionIndex][3]; 
    document.getElementById("D").innerHTML = questions[questionIndex][4]; 

    for(var i = 0; i < players.length; i++){
            players[i].answered = false;
    }

    startTimer(10);
}

function Quiz() {
	this.canvas = null;
	this.game = null;

	//initializes the game
	this.init = function() {
		
		//set up the lobby and canvas
		this.game = new Game(2, 2);
		this.game.startLobby();

		//the div for the question
		var div = document.createElement('div');
		div.style.backgroundColor = "#00FF7F";
		div.style.height = window.innerHeight * .60 + "px";
		div.style.width = "100%";
		div.align = "center";
        div.id = "main";

		var question = document.createElement('button');
		question.innerText = "Question";
		question.style.height = (window.innerHeight * .65) / 8 + "px";
		question.style.width = "55%";
		question.id = "Q";
        question.style.outline = "none";
        question.style.marginTop = "10px";
        question.style.border = "1px solid black";
        question.style.borderRadius = "10px";
        question.style.backgroundColor = "#996699";

		//the 4 choices
		var choiceA = document.createElement('button');
		choiceA.innerText = "Choice A";
		choiceA.style.height = (window.innerHeight * .60) / 8 + "px";
		choiceA.style.width = "51%";
		choiceA.id = "A";
        choiceA.style.outline = "none";
        choiceA.style.marginTop = "10px";
        choiceA.style.border = "1px solid black";
        choiceA.style.borderRadius = "10px";
        choiceA.style.backgroundColor = "#996699";

		var choiceB = document.createElement('button');
		choiceB.innerText = "Choice B";
		choiceB.style.height = (window.innerHeight * .60) / 8 + "px";
		choiceB.style.width = "51%";
		choiceB.id = "B";
        choiceB.style.outline = "none";
        choiceB.style.marginTop = "10px";
        choiceB.style.border = "1px solid black";
        choiceB.style.borderRadius = "10px";
        choiceB.style.backgroundColor = "#996699";
		
		var choiceC = document.createElement('button');
		choiceC.innerText = "Choice C";
		choiceC.style.height = (window.innerHeight * .60) / 8 + "px";
		choiceC.style.width = "51%";
		choiceC.id = "C";
        choiceC.style.outline = "none";
        choiceC.style.marginTop = "10px";
        choiceC.style.border = "1px solid black";
        choiceC.style.borderRadius = "10px";
        choiceC.style.backgroundColor = "#996699";
		
		var choiceD = document.createElement('button');
		choiceD.innerText = "Choiljijoce D";
		choiceD.style.height = (window.innerHeight * .60) / 8 + "px";
		choiceD.style.width = "51%";
		choiceD.id = "D";
        choiceD.style.outline = "none";
        choiceD.style.marginTop = "10px";
        choiceD.style.border = "1px solid black";
        choiceD.style.borderRadius = "10px";
        choiceD.style.backgroundColor = "#996699";

		div.appendChild(question);
		div.appendChild(choiceA);
		div.appendChild(choiceB);
		div.appendChild(choiceC);
		div.appendChild(choiceD);
        var timer = document.createElement("p");
        timer.style.width = "99%";
		timer.id = "timer";
        timer.innerText="0:00";
        div.appendChild(timer);

		document.getElementsByTagName("body")[0].insertBefore(div, null);

		//set the control handler
		this.game.setControlHandler(
			this.handleControls
		);

		//start the game
		this.game.startGame();		
		newQuestion();
	};

	//the control handler function
	this.handleControls = function(uuid, msg){

		//check all player ids
		for(var i = 0; i < this.game.playerIds.length; i++){
			
			//get the matching player
			if(uuid == this.game.playerIds[i]){
                if(msg == 5){
                    if(document.getElementById(uuid).style.backgroundColor == "white"){
                        document.getElementById(uuid).style.backgroundColor = players[i].backgroundColor;
                    } else {
                        document.getElementById(uuid).style.backgroundColor = "white";
                    }
                }

                //players can't answer twice
                if(this.players[i].answered = true){
                    break;
                }

				//check if the answer is correct and update score
				if(questions[questionIndex][5] == msg){
					this.players[i].score++;
                    document.getElementById(uuid).innerHTML = players[i].score;

                    if(this.players[i].score == 20){
                        this.game.endGame();
                    }
				} else {
					this.players[i].score--;
				}

				//don't let the player answer twice
				this.players[i].answered = true;
				break;
			}
		}
	};

	//set up a new player
	this.addPlayer = function(name, number) {
        alert();
        var width = 100 / (players.length + 1);

        var p = document.createElement('div');
        p.innerHTML = "0";

        for(var i = 0; i < players.length; i++){
            players[i].p.width = width + "%";
        }

        document.getElementById('main').appendChild(p);

        var player = new Player(name, number, p);
		players.push(player);
	}

	this.init();
}

function addPlayer(n, num) {
        var width = 97 / (players.length + 1);
        
        var p = document.createElement('button');
        p.innerHTML = n + ": 0";
        p.style.outline = "none";
        p.style.marginTop = "10px";
        p.style.border = "1px solid black";
        p.style.borderRadius = "10px";
        p.style.width = width + "%";
        p.style.height = "30px";

        var c = getRandomColor();

        p.style.backgroundColor = c;

        for(var i = 0; i < players.length; i++){
            players[i].div.style.width = width + "%";
        }

        document.getElementById('main').appendChild(p);

        var player = {name: name, id: num, div: p, score: 0, color: c, answered: false};
		players.push(player);
}

/*Returns a random Hex Color as a string*/
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color = color + letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function Player(n, p) {
    alert("wefwefgrgrth");

    var player = {name:n, id: num, div: p, score: 0, color: getRandomColor(), answered: false};

	this.name = name;
	this.id = number;
	this.color = getRandomColor();
	this.score = 0;
	this.answered = false;
    this.p = p;

    p.style.backgroundColor = color;
}

window.onload = function(){
	var quiz = new Quiz();
}

function startTimer(seconds){
	var now = new Date().getTime();
	var then = now + seconds * 1000;
	
	// Update the count down every 1 second
	var x = setInterval(function() {
		// get the current time
		var now = new Date().getTime();
		var distance = then - now;

        // If the count down is finished, write some text 
		if (distance <= 0) {
			clearInterval(x);
            newQuestion();
            return;
		}

		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        var extra;
        if(seconds < 10){
            extra = 0;
        }

		// Display the result in the element with id="demo"
		document.getElementById("timer").innerHTML = minutes + ":" + extra + seconds;
	}, 100);
}