#include "GameRoom.h"
#include <iostream>

#define ROOM_CODE_LEN 5

const std::string CODE_CHARS = "ABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789";
const std::string UUID_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

using namespace json11;

GameRoom::GameRoom(std::vector<GameRoom*>* vecGameRooms) {
    hostSocket = SOCKET_ERROR;
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
void GameRoom::readClientUpdates(SOCKET clientSocket) {
	bool bSetup = false;
    int playerNum = GAME_HOST;

	while (!bExit) {
		char buffer[1024] = { 0 };
		int n = recv(clientSocket, buffer, 1023, 0);
        if (n >= 0) {
            std::string decoded = WSF::decodeMessage(buffer);

            if (!bSetup) {
                bSetup = true;
                bool bIsHost = false;

                std::string strErr;
                Json jsonIdentity = Json::parse(decoded, strErr);

                if (jsonIdentity["uuid"] != Json()) {
                    std::string uuid = jsonIdentity["uuid"].string_value();
                    //TODO: Fix a second host connecting (room freezes?)
                    if (uuid == strUUID) {
                        if (hostSocket != SOCKET_ERROR) WSF::closeSocket(hostSocket);
                        hostSocket = clientSocket;
                        bIsHost = true;
                        std::cout << "Host connected" << std::endl;
                    }
                }

                if (!bIsHost) {
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
                    } else {
                        //create a new player slot
                        playerNum = vecControllers.size();
                        vecControllers.push_back(clientSocket);
                    }

                    std::cout << "Player " << playerNum + 1 << " connected" << std::endl;
                }
            } else {
                if (playerNum != GAME_HOST) {
                    //send new controller data to game host
                    if (decoded == MSG_TEXT_CLOSE) {
                        WSF::closeSocket(vecControllers.at(playerNum));
                        vecControllers.at(playerNum) = SOCKET_ERROR;    //"remove" from socket vector
                        std::cout << "Player " << playerNum + 1 << " disconnected" << std::endl;
                        sendHostUpdate(decoded);
                        return;    //stop the thread
                    } else {
                        std::cout << "[Client Update]: " << decoded << std::endl;
                        sendHostUpdate(decoded);
                    }
                } else {
                    //process host updates (new game, max player change, password change, etc.)
                    if (decoded == MSG_TEXT_CLOSE) {
                        WSF::closeSocket(hostSocket);
                        hostSocket = SOCKET_ERROR;    //"remove" from socket vector
                        std::cout << "Host disconnected" << std::endl;
                        std::cout << "[Broadcast]: Host disconnected" << std::endl;
                        controllerBroadcast(decoded);
                        return;    //stop the thread
                    } else {
                        std::cout << "[Host Update]: " << decoded << std::endl;
                    }
                }
            }
        } else {
            //error in socket reading
            //stop the thread
            return;
        }
	}
}

void GameRoom::processConnections() {
	while (!bExit) {
		SOCKET clientSocket = qSockets->pop();
		bool bConn = WSF::newConnection(clientSocket);

		if (bConn) {
            //listen for new updates
            std::thread thrReadUpdates = std::thread([this, clientSocket] {this->readClientUpdates(clientSocket);});
            thrReadUpdates.detach();
		}
		else {
            //if handshake wasn't successful, close
            WSF::closeSocket(clientSocket);
		}
	}
}
