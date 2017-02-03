#pragma once

#include "WebSocketFunctions.h"
#include <vector>
#include <thread>
#include "json11-master/json11.hpp"
#include <atomic>

#define GAME_HOST -1

class GameRoom {
public:
	GameRoom(std::vector<GameRoom*>* vecGameRooms);
	~GameRoom();

	void initGame(json11::Json jsonData);
	std::thread initGameThread(json11::Json jsonData);
	std::string getCode();

private:
	//functions
	std::string generateRoomCode(std::vector<GameRoom*>* vecGameRooms);
	void sendHostUpdate(std::string controllerData);
	void controllerBroadcast(std::string msgBroadcast);
	void readClientUpdates(int playerNum);
	void processConnections();

	//variables
	std::string strName;
	std::string strCode;
	std::string strPassword;
	int roomNum;
	int gameType;
	int maxPlayers;
	int portNum;

	ThreadQueue<SOCKET>* qSockets;
	std::vector<std::string> gameVariables;
	std::atomic<SOCKET> hostSocket;
	std::vector<SOCKET> vecControllers;

	std::atomic<bool> bExit;
	std::atomic<bool> hostConnected;
};