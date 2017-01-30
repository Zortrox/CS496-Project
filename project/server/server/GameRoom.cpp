#include "GameRoom.h"

#include <iostream>

GameRoom::GameRoom() {
}

GameRoom::~GameRoom() {
	bExit = true;
}

void GameRoom::initGame(json11::Json jsonData) {
	strName = jsonData["name"].string_value();
	strPassword = jsonData["pass"].string_value();
	roomNum = jsonData["room"].int_value();
	gameType = jsonData["game"].int_value();
	maxPlayers = jsonData["players"].int_value();
	portNum = jsonData["port"].int_value();

	bExit = false;

	qSockets = new ThreadQueue<SOCKET>();
	std::thread listener(WSF::listenConnections, qSockets, portNum, &bExit);
	listener.detach();

	processUpdates();
}

std::thread GameRoom::initGameThread(json11::Json jsonData) {
	return std::thread([this, jsonData] { this->initGame(jsonData); });
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