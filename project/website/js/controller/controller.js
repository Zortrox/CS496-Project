/*
TODO: what is this?
var ws;

function WebSocketSetup() {
	if (window.WebSocket)
	{
		alert("WebSocket is supported by your Browser!");
		
		// Let us open a web socket
		ws = new WebSocket("ws://localhost:3002");
		
		ws.onopen = function() {
			// Web Socket is connected
			ws.send("[[connected]]");
		};
		
		ws.onmessage = function (evt) 
		{ 
			var received_msg = evt.data;
			alert("Message is received...\n"+received_msg);
		};
		
		ws.onclose = function()
		{ 
			// websocket is closed.
		};
	}
	else
	{
		// The browser doesn't support WebSocket
		alert("WebSocket NOT supported by your Browser!");
	}
}

WebSocketSetup();
*/

//Controller API
var MSG_TYPE_START_GAME = 0;
var MSG_TYPE_END_GAME = 1;
var MSG_TYPE_NEW_PLAYER_JOIN = 2;
var MSG_TYPE_CONTROL_DATA = 3;

var GAME_CREATED = 0;
var GAME_LOBBYING = 1;
var GAME_ACTIVE = 2;
var GAME_ENDED = 3;


function Controller(){
	var controllerServerSocket = null;
	var active = false;
	this.data = {};

	this.setup = function(){
		//special initilization message
		var message = {
			name:getCookie("name"),
			room:getCookie("gameroom"),
			uuid:getCookie("uuid")
		}
		controllerServerSocket = new WebSocket("ws://digibara.com/ws");
		controllerServerSocket.onopen = function(){
			controllerServerSocket.send(JSON.stringify(message));
			active = true;
		}
		controllerServerSocket.onmessage = function(msg){
			console.log("message received");
			//TODO: handle parse errors here
			pack = JSON.parse(msg);
			if(msg.msgtype == MSG_TYPE_END_GAME){
				controllerServerSocket.close();
			}
			//TODO: handle incoming messages from host - not first priority
		}
	}

	//sends the current state
	this.sendState = function(){
		this.sendMessage(this.data);
	}

	//sends a specific message
	this.sendMessage = function(msg){
		if(active){
			var message = {
				msgtype: MSG_TYPE_CONTROL_DATA,
				uuid:getCookie("uuid"),
				data:msg
			}
			controllerServerSocket.sendMessage(JSON.stringify(message));
		}
	}

	//TODO: provide a looping mechanism that calls sendState at a specified framerate if the developer wants it

}