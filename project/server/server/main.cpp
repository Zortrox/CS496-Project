/*Game server for communicating with the website, host screen,
and controllers*/

#include <thread>
#include <iostream>
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

int main(int argc, char *argv[]) {

#ifdef _WIN32
	WSADATA wsaData;
	WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif

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

		//get next empty room position
		int indexEmptyRoom = nextEmptyRoom(vecGameRooms);

		if (indexEmptyRoom < 0) {
			//no empty room
			WSF::closeSocket(clientSocket);
		}
		else {
			//process PHP info
			Json phpData;
			WSF::newPHPRequest(clientSocket, &phpData, indexEmptyRoom);

			//create new room at next empty position
			vecGameRooms.at(indexEmptyRoom) = new GameRoom();
			std::thread thrRoom = vecGameRooms.at(indexEmptyRoom)->initGameThread(phpData);
			thrRoom.detach();
			std::cout << "[New Room Created]" << std::endl;
		}
	}

#ifdef _WIN32
	WSACleanup();
#endif

	std::cin.ignore();

	return 0;
}