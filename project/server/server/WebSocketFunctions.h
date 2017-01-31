#pragma once

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN 1
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#endif

#include <string>
#include <atomic>
#include "ThreadQueue.hpp"
#include "json11-master\json11.hpp"

#define ROOM_PORT_START 3000
#define PHP_PORT 2000

#define MSG_OPCODE_TEXT 0x1
#define MSG_OPCODE_CLOSE 0x8

#define MSG_TEXT_CLOSE "[[close]]"

class WSF {
public:
	static std::string decodeMessage(std::string msg);
	static std::string encodeMessage(std::string msg);
	static std::string handshakeResponse(std::string msg);
	static void newConnection(SOCKET sock);
	static void newPHPRequest(SOCKET sock, json11::Json* phpData, int roomNum);
	static void listenConnections(ThreadQueue<SOCKET>* qSockets, int port, std::atomic<bool>* bExit);
	static void closeSocket(SOCKET sock);

private:
	static std::string base64Encode(unsigned char const* charEncode, unsigned int length);
	static std::string hexDecode(std::string strIn);
};