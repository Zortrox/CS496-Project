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

function Controller(){
	var controllerServerSocket = null;
	this.data = {};

	this.setup = function(){
		//special initilization message
		var message = {
			name:getCookie("name"),
			room:getCookie("gameroom"),
			uuid:getCookie("uuid")
		}
		controllerServerSocket = new WebSocket("http://digibara.com/ws");
		controllerServerSocket.onopen = function(){
			controllerServerSocket.send(JSON.stringify(message));
		}

	}
}