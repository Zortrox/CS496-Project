/*Game server for communicating with the website, host screen,
and controllers*/

#include <thread>
#include <iostream>
#include <time.h>
#include "ThreadQueue.hpp"
#include "GameRoom.h"

#define MAX_ROOMS 10

using namespace json11;

int nextEmptyRoom(std::vector<GameRoom*> vecGameRooms) {
	for (size_t i = 0; i < vecGameRooms.size(); i++) {
		if (vecGameRooms[i] == NULL) return i;
	}

	return -1;
}

int getRoomFromCode(Json jsonData, std::vector<GameRoom*>* vecGameRooms) {
	std::string roomCode = jsonData.string_value();
	for (size_t i = 0; i < vecGameRooms->size(); i++) {
		if (vecGameRooms->at(i)->getCode() == roomCode) {
			return i;
		}
	}

	return -1;
}

int main(int argc, char *argv[]) {

#ifdef _WIN32
	WSADATA wsaData;
	WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif

	std::srand(std::time(NULL));

    std::cout << "Server Started" << std::endl;

	std::vector<GameRoom*> vecGameRooms;
	vecGameRooms.resize(MAX_ROOMS, NULL);
	
	//thread-safe queue for connections
	ThreadQueue<SOCKET>* qSockets = new ThreadQueue<SOCKET>();
	//listen for new web server connections on port 2000
	//store them in the queue
	std::atomic<bool> bExit{false};
	std::thread listener(WSF::listenConnections, qSockets, PHP_PORT, &bExit);
	listener.detach();

	//process new web server connections
	while (!bExit) {
		SOCKET clientSocket = qSockets->pop();

		std::cout << "[new PHP connection]" << std::endl;

		std::string strErr;
		std::string jsonData = WSF::getPHPData(clientSocket);
		Json phpData = Json::parse(jsonData, strErr);

		if (phpData["game"] != Json()) {
			//get next empty room position
			int indexEmptyRoom = nextEmptyRoom(vecGameRooms);

			if (indexEmptyRoom >= 0) {
				//create new room at next empty position
				vecGameRooms.at(indexEmptyRoom) = new GameRoom(&vecGameRooms);

				//add room number and port to room Json
				Json::object roomData = Json::object(phpData.object_items());
				roomData["room"] = vecGameRooms.at(indexEmptyRoom)->getCode();
				roomData["port"] = ROOM_PORT_START + indexEmptyRoom;
				roomData["uuid"] = vecGameRooms.at(indexEmptyRoom)->getUUID();
				phpData = Json{ roomData };

				std::thread thrRoom = vecGameRooms.at(indexEmptyRoom)->initGameThread(phpData);
				thrRoom.detach();
				std::cout << "[New Room Created]" << std::endl;

				WSF::sendPHPData(clientSocket, phpData.dump());
			} else {
				//send no empty room
				std::cout << "All rooms full" << std::endl;

				Json::object roomData = Json::object(phpData.object_items());
				roomData["error"] = "all rooms full";
				phpData = Json{ roomData };
				WSF::sendPHPData(clientSocket, phpData.dump());
			}
		}
		else if (phpData["room"] != Json()) {
			int roomNum = getRoomFromCode(phpData["room"], &vecGameRooms);

			if (roomNum >= 0) {
				Json::object roomData = Json::object(phpData.object_items());
				roomData["port"] = ROOM_PORT_START + roomNum;
				phpData = Json{ roomData };

				WSF::sendPHPData(clientSocket, phpData.dump());
			}
			else {
				//send no room exists
				std::cout << "No room with code exists" << std::endl;

				Json::object roomData = Json::object(phpData.object_items());
				roomData["error"] = "no room found";
				phpData = Json{ roomData };
				WSF::sendPHPData(clientSocket, phpData.dump());
			}
		} else {
			//some error happened
			std::cout << "[error occurred]" << std::endl;

			Json::object roomData = Json::object(phpData.object_items());
			roomData["error"] = "error occurred";
			phpData = Json{ roomData };
			WSF::sendPHPData(clientSocket, phpData.dump());
		}

		WSF::closeSocket(clientSocket);
	}

#ifdef _WIN32
	WSACleanup();
#endif

	std::cin.ignore();

	return 0;
}