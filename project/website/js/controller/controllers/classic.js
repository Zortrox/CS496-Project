/*
Classic controller

Has up-down-left-right buttons, as well as a and b

Data packet:

"up" : 0 or 1 (1 is pressed)
"down" : 0 or 1
"left" : 0 or 1
"right" : 0 or 1
"a" : 0 or 1
"b" : 0 or 1

Data packets are sent on button change
*/

var controller;

function setupController(){
	controller = new Controller();
	controller.data["up"] = 0;
	controller.data["down"] = 0;
	controller.data["left"] = 0;
	controller.data["right"] = 0;
	controller.data["a"] = 0;
	controller.data["b"] = 0;

var css = ' \
	.circle { \
		text-align: center; \
		width: 15vw;\
		height: 15vw;\
		border-radius: 50%;\
		border-style: solid\
	}';
	controller.setCSS(css);
	var leftArrowDiv = document.createElement("i");
	leftArrowDiv.className = "fa fa-arrow-left";
	leftArrowDiv.style = "font-size: 15vw; position: fixed; top: 40vh; left: 10vw;";
	leftArrowDiv.setAttribute("onmousedown", "eventHandle('left',1)");
	leftArrowDiv.setAttribute("onmouseup", "eventHandle('left',0)");
	controller.addHTMLObject(leftArrowDiv);
	var rightArrowDiv = document.createElement("i");
	rightArrowDiv.style = "font-size: 15vw; position: fixed; top: 40vh; left: 30vw;";
	rightArrowDiv.className = "fa fa-arrow-right";
	rightArrowDiv.setAttribute("onmousedown", "eventHandle('right',1)");
	rightArrowDiv.setAttribute("onmouseup", "eventHandle('right',0)");
	controller.addHTMLObject(rightArrowDiv);
	var upArrowDiv = document.createElement("i");
	upArrowDiv.style = "font-size: 15vw; position: fixed; top: 20vh; left: 20vw;";
	upArrowDiv.className = "fa fa-arrow-up";
	upArrowDiv.setAttribute("onmousedown", "eventHandle('up',1)");
	upArrowDiv.setAttribute("onmouseup", "eventHandle('up',0)");
	controller.addHTMLObject(upArrowDiv);
	var downArrowDiv = document.createElement("i");
	downArrowDiv.style = "font-size: 15vw; position: fixed; top: 60vh; left: 20vw;";
	downArrowDiv.className = "fa fa-arrow-down";
	controller.addHTMLObject(downArrowDiv);
	downArrowDiv.setAttribute("onmousedown", "eventHandle('down',1)");
	downArrowDiv.setAttribute("onmouseup", "eventHandle('down',0)");
	var aDiv = document.createElement("button");
	aDiv.className = "circle";
	aDiv.innerHTML = "A";
	aDiv.style = "font-size: 12vw; position: fixed; top: 60vh; left: 77vw;";
	aDiv.setAttribute("onmousedown", "eventHandle('a',1)");
	aDiv.setAttribute("onmouseup", "eventHandle('a',0)");
	controller.addHTMLObject(aDiv);
	var bDiv = document.createElement("button");
	bDiv.className = "circle";
	bDiv.innerHTML = "B";
	bDiv.style = "font-size: 12vw; position: fixed; top: 70vh; left: 55vw;";
	bDiv.setAttribute("onmousedown", "eventHandle('b',1)");
	bDiv.setAttribute("onmouseup", "eventHandle('b',0)");
	controller.addHTMLObject(bDiv);
	controller.setup();
}

function eventHandle(field, num){
	controller.data[""+field] = num;
	controller.sendState();
}

window.onload = function(){
    setupController();
}