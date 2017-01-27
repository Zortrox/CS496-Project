/*Game server for communicating with the website, host screen,
and controllers*/

#include <stdlib.h>
#include <thread>

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN 1
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#endif

#include <iostream>
#include <string>
#include "ThreadQueue.hpp"
#include "GameRoom.h"
#include "json11-master\json11.hpp"

using namespace json11;

int main(int argc, char *argv[]) {
	WSADATA wsaData;
	WSAStartup(MAKEWORD(2, 2), &wsaData);

	std::vector<GameRoom*> vecGameRooms;
	
	//thread-safe queue for connections
	ThreadQueue<SOCKET>* qSockets = new ThreadQueue<SOCKET>();
	//listen for new web server connections on port 2000
	//store them in the queue
	std::atomic<bool> bExit = false;
	std::thread listener(WSF::listenConnections, qSockets, 2000, &bExit);
	listener.detach();

	//process new web server connections
	while (!bExit) {
		SOCKET clientSocket = qSockets->pop();
		WSF::newConnection(clientSocket);
		//get PHP JSON values
		//parse to get game information
		std::string strErr;
		std::string strJson = "{\"name\":\"IDEK\","
			"\"room\":1234,"
			"\"game\":1,"
			"\"players\":5,"
			"\"port\":3005,"
			"\"pass\":\"pika\"}";
		Json phpData = Json::parse(strJson, strErr);

		//create new room
		GameRoom* room = new GameRoom(phpData);
		vecGameRooms.push_back(room);
		std::thread thrRoom(room->initGame);
		thrRoom.detach();
		std::cout << "[New Room Created]" << std::endl;
	}

#ifdef _WIN32
	WSACleanup();
#endif

	std::cin.ignore();

	return 0;
}