#include "GameRoom.h"
#include <iostream>

#define ROOM_CODE_LEN 5

const std::string CODE_CHARS = "ABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789";
const std::string UUID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

GameRoom::GameRoom(std::vector<GameRoom*>* vecGameRooms) {
	hostConnected = false;

	generateRoomCode(vecGameRooms);
	generateUUID();
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

	processConnections();
}

std::thread GameRoom::initGameThread(json11::Json jsonData) {
	return std::thread([this, jsonData] { this->initGame(jsonData); });
}

std::string GameRoom::getCode() {
	return strCode;
}

std::string GameRoom::getUUID() {
    return strUUID;
}

void GameRoom::generateRoomCode(std::vector<GameRoom *> *vecGameRooms) {
	strCode = "";
	bool goodCode = false;

	while (!goodCode) {
		for (int i = 0; i < ROOM_CODE_LEN; i++) {
			int pos = std::rand() % 36;
			strCode += CODE_CHARS.at(pos);
		}
		goodCode = true;

		for (size_t i = 0; i < vecGameRooms->size(); i++) {
			//check that
			if (vecGameRooms->at(i) != NULL && this != vecGameRooms->at(i) && vecGameRooms->at(i)->getCode() == strCode) {
				goodCode = false;
			}
		}
	}
}

void GameRoom::generateUUID(){
    strUUID = std::string(36, ' ');

    strUUID[8] = '-';
    strUUID[13] = '-';
    strUUID[18] = '-';
    strUUID[23] = '-';

    for(int i = 0; i < 36; i++){
        if (i != 8 && i != 13 && i != 18 && i != 23) {
            strUUID[i] = UUID_CHARS[std::rand() % 36];
        }
    }
}

//send controller updates to host
void GameRoom::sendHostUpdate(std::string controllerData) {
	std::string encoded = WSF::encodeMessage(controllerData);
	send(hostSocket, encoded.c_str(), encoded.length(), 0);
}

//broadcast new information (new game type, etc.) to controllers
void GameRoom::controllerBroadcast(std::string msgBroadcast) {
	std::string encoded = WSF::encodeMessage(msgBroadcast);

	for (size_t i = 0; i < vecControllers.size(); i++) {
		SOCKET sock = vecControllers.at(i);
		send(sock, encoded.c_str(), encoded.length(), 0);
	}
}

//read controller button presses or other updates
void GameRoom::readClientUpdates(int playerNum) {
	SOCKET sock;
	if (playerNum == GAME_HOST) sock = hostSocket;
	else sock = vecControllers.at(playerNum);

	while (!bExit) {
		char buffer[1024] = { 0 };
		int n = recv(sock, buffer, 1023, 0);
		std::string decoded = WSF::decodeMessage(buffer);
		//std::cout << "Here is the message: " << decoded << std::endl;

		if (playerNum != GAME_HOST) {
			//send new controller data to game host
			if (decoded == MSG_TEXT_CLOSE) {
				WSF::closeSocket(vecControllers.at(playerNum));
				vecControllers.at(playerNum) = SOCKET_ERROR;	//"remove" from socket vector
				std::cout << "Player " << playerNum << " disconnected" << std::endl;
				sendHostUpdate(decoded);
				return;	//stop the thread
			}
			else {
				std::cout << "[Client Update]: " << decoded << std::endl;
				sendHostUpdate(decoded);
			}
		}
		else {
			//process host updates (new game, max player change, password change, etc.)
			if (decoded == MSG_TEXT_CLOSE) {
				WSF::closeSocket(hostSocket);
				hostSocket = SOCKET_ERROR;	//"remove" from socket vector
				std::cout << "Host disconnected" << std::endl;
				std::cout << "[Broadcast]: Host disconnected" << std::endl;
				hostConnected = false;
				controllerBroadcast(decoded);
				return;	//stop the thread
			}
			else {
				std::cout << "[Host Update]: " << decoded << std::endl;
			}
		}
	}
}

void GameRoom::processConnections() {
	while (!bExit) {
		SOCKET clientSocket = qSockets->pop();
		WSF::newConnection(clientSocket);
		int playerNum = GAME_HOST;		//-1 for host, 0+ for controllers

		if (hostConnected) {
			//check for an empty player slot first
			bool bEmptySlot = false;
			for (size_t i = 0; i < vecControllers.size(); i++) {
				if (vecControllers.at(i) == SOCKET_ERROR) {
					playerNum = i;
					bEmptySlot = true;
					break;
				}
			}
			
			if (bEmptySlot) {
				vecControllers.at(playerNum) = clientSocket;
			}
			else {
				//create a new player slot
				playerNum = vecControllers.size();
				vecControllers.push_back(clientSocket);
			}
			
			std::cout << "Player " << playerNum << " connected to Room " << roomNum << std::endl;
		}
		else {
			hostConnected = true;
			std::cout << "Host connected to Room " << roomNum << std::endl;
			hostSocket = clientSocket;
		}

		//listen for new updates
		std::thread thrReadUpdates = std::thread([this, playerNum] {this->readClientUpdates(playerNum);});
		thrReadUpdates.detach();
	}
}
