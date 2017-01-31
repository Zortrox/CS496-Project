/**
 * Created by Chris on 1/25/2017.
 * The purpose of this script is to make the menus on the Web Page interactive
 */




// Create Click Handlers for Buttons
document.getElementById("host-btn").onclick = function (e) {
    show('host-menu');
    hide('main-menu');
};


document.getElementById("join-btn").onclick = function (e) {
    show('join-menu');
    hide('main-menu');
};

document.getElementById("games-btn").onclick = function (e) {
    show('game-menu');
    hide('main-menu');
};

document.getElementById("info-btn").onclick = function (e) {

};

function hide(name){
    var menu = document.getElementById(name);
    menu.style.display = "none";
}

function show(name){
    var menu = document.getElementById(name);
    menu.style.display = "block";
}