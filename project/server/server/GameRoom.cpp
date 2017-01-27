#include "GameRoom.h"

#include <iostream>

GameRoom::GameRoom(std::string name, int room, int game, int players, int port, std::string pass) {
	strName = name;
	strPassword = pass;
	roomNum = room;
	gameType = game;
	maxPlayers = players;
	portNum = port;
}

GameRoom::GameRoom(json11::Json jsonData) {
	strName = jsonData["name"].string_value();
	strPassword = jsonData["pass"].string_value();
	roomNum = jsonData["room"].int_value();
	gameType = jsonData["game"].int_value();
	maxPlayers = jsonData["players"].int_value();
	portNum = jsonData["port"].int_value();
}

GameRoom::~GameRoom() {
	bExit = true;
}

void GameRoom::initGame() {
	bExit = false;

	qSockets = new ThreadQueue<SOCKET>();
	std::thread listener(WSF::listenConnections, qSockets, portNum, &bExit);
	listener.detach();

	processUpdates();
}

void GameRoom::sendHostUpdate() {

}

void GameRoom::processUpdates() {
	while (!bExit) {
		SOCKET clientSocket = qSockets->pop();
		WSF::newConnection(clientSocket);
		std::cout << "[New Player]" << std::endl;
	}
}