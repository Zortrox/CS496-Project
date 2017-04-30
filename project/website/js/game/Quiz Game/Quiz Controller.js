/*
Quiz Controller

Has 5 buttons: A, B, C, D, and check score

Data packet:
none

Data packets are sent on button change
*/

function setupController(){
	var controller = new Controller();

    var buttonA = document.createElement('button');
    buttonA.innerText = "A";
    buttonA.addEventListener("click", this.sendMessage(1));

    var buttonB = document.createElement('button');
    buttonA.innerText = "B";
    buttonA.addEventListener("click", this.sendMessage(2));

    var buttonC = document.createElement('button');
    buttonA.innerText = "C";
    buttonA.addEventListener("click", this.sendMessage(3));

    var buttonD = document.createElement('button');
    buttonA.innerText = "D";
    buttonA.addEventListener("click", this.sendMessage(4));

    var buttonCheck = document.createElement('button');
    buttonA.innerText = "Score";
    buttonA.addEventListener("click", this.sendMessage(5));

    controller.addHTMLObject(buttonA, 1);
    controller.addHTMLObject(buttonB, 2);
    controller.addHTMLObject(buttonC, 3);
    controller.addHTMLObject(buttonD, 4);
    controller.addHTMLObject(buttonCheck, 5);
}

window.onload = function(){
    setupController();
}