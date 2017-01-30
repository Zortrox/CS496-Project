#pragma once

#include "WebSocketFunctions.h"
#include <vector>
#include <atomic>
#include <thread>
#include "json11-master\json11.hpp"

class GameRoom {
public:
	GameRoom();
	~GameRoom();

	void initGame(json11::Json jsonData);
	std::thread initGameThread(json11::Json jsonData);

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