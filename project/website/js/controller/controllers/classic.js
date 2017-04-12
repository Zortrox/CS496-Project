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


function setupController(){
	var controller = new Controller();
	controller.data["up"] = 0;
	controller.data["down"] = 0;
	controller.data["left"] = 0;
	controller.data["right"] = 0;
	controller.data["a"] = 0;
	controller.data["b"] = 0;

	var css = ' \
	+ .arrowUp { \
	  width: 0;  \
	  height: 0;  \
	  border-style: 10vw solid; \
	  border: transparent transparent transparent black \
	} \
		 \
	.arrowDown { \
	  width: 0;  \
	  height: 0;  \
	  border-style: 10vw solid; \
	  border: transparent transparent black transparent \
	} \
		\
	.arrowRight {\
	  width: 0; \
	  height: 0; \
	  border-style: 10vw solid; \
	  border: transparent black transparent transparent \
	}\
	\
	.arrowLeft {\
	  width: 0; \
	  height: 0; \
	  border-style: 10vw solid; \
	  border: black transparent transparent transparent \
	}\
	.circle { \
		width: 10vw;\
		height: 10vw;\
		border-radius: 50%;\
	}';
	controller.setCSS(css);
	var leftArrowDiv = document.createElement("div");
	leftArrowDiv.className = "arrowLeft";
	$(leftArrowDiv).bind("touchstart mousedown", function() {
		controller.data["left"] = 1;
		controller.sendState();
	});
	$(leftArrowDiv).bind("touchend mouseup", function() {
		controller.data["left"] = 0;
		controller.sendState();
	});
	controller.addHTMLObject(leftArrowDiv);
	var rightArrowDiv = document.createElement("div");
	rightArrowDiv.className = "arrowRight";
	$(rightArrowDiv).bind("touchstart mousedown", function() {
		controller.data["right"] = 1;
		controller.sendState();
	});
	$(rightArrowDiv).bind("touchend mouseup", function() {
		controller.data["right"] = 0;
		controller.sendState();
	});
	controller.addHTMLObject(rightArrowDiv);
	var upArrowDiv = document.createElement("div");
	upArrowDiv.className = "arrowUp";
	$(upArrowDiv).bind("touchstart mousedown", function() {
		controller.data["up"] = 1;
		controller.sendState();
	});
	$(upArrowDiv).bind("touchend mouseup", function() {
		controller.data["up"] = 0;
		controller.sendState();
	});
	controller.addHTMLObject(upArrowDiv);
	var downArrowDiv = document.createElement("div");
	downArrowDiv.className = "arrowDown";
	controller.addHTMLObject(downArrowDiv);
	$(downArrowDiv).bind("touchstart mousedown", function() {
		controller.data["down"] = 1;
		controller.sendState();
	});
	$(downArrowDiv).bind("touchend mouseup", function() {
		controller.data["down"] = 0;
		controller.sendState();
	});
	var aDiv = document.createElement("div");
	aDiv.className = "circle";
	aDiv.innerHTML = "A";
	$(aDiv).bind("touchstart mousedown", function() {
		controller.data["a"] = 1;
		controller.sendState();
	});
	$(aDiv).bind("touchend mouseup", function() {
		controller.data["a"] = 0;
		controller.sendState();
	});
	controller.addHTMLObject(aDiv);
	var bDiv = document.createElement("div");
	bDiv.className = "circle";
	bDiv.innerHTML = "B";
	$(bDiv).bind("touchstart mousedown", function() {
		controller.data["b"] = 1;
		controller.sendState();
	});
	$(bDiv).bind("touchend mouseup", function() {
		controller.data["b"] = 0;
		controller.sendState();
	});
	controller.addHTMLObject(bDiv);
}

window.onload = function(){
    setupController();
}