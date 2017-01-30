#pragma once

#include "WebSocketFunctions.h"
#include <vector>
#include <atomic>
#include "json11-master\json11.hpp"

class GameRoom {
public:
	GameRoom(std::string name, int room, int game, int players, int port, std::string pass = "");
	GameRoom(json11::Json jsonData);

	~GameRoom();

	void initGame();

private:
	//functions
	void sendHostUpdate();
	void processUpdates();

	//variables
	std::string strName;
	std::string strPassword;
	int roomNum;
	int gameType;
	int maxPlayers;
	int portNum;

	ThreadQueue<SOCKET>* qSockets;
	std::vector<std::string> gameVariables;

	std::atomic<bool> bExit;
};