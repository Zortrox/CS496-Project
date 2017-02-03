#include "WebSocketFunctions.h"

#include <iostream>
#include <unistd.h>
#include <string.h>
#include "sha1-master/sha1.hpp"

static const std::string WS_MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
static const std::string BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

//decode the WebSocket client message
std::string WSF::decodeMessage(std::string msg) {
	std::string decoded = "";
	char firstByte = msg[0];

	if ((firstByte & 0xF) == MSG_OPCODE_TEXT) { //if first byte is "xxxx 0001"
		char secondByte = msg[1];

		int length = secondByte & 127;
		int indexFirstMask = 2;

		if (length == 126) indexFirstMask = 4;
		else if (length == 127)  indexFirstMask = 10;

		char masks[] = { msg[indexFirstMask], msg[indexFirstMask + 1], msg[indexFirstMask + 2], msg[indexFirstMask + 3] };

		int indexFirstDataByte = indexFirstMask + 4;
		for (size_t i = indexFirstDataByte, j = 0; i < msg.length(); i++, j++) {
			decoded += (msg[i] ^ masks[j % 4]);
		}
	}
	else if ((firstByte & 0xF) == MSG_OPCODE_CLOSE) { //if first byte is "xxxx 1000"
		decoded = "[[close]]";
	}

	return decoded;
}

//encodes the message to send to a WebSocket
std::string WSF::encodeMessage(std::string msg) {
	std::string encoded = "";

	//129 is a text message
	encoded += (char)129;

	//set the size of the message
	if (msg.length() <= 125) {
		encoded += (char)msg.length();
	}
	else if (msg.length() >= 126 && msg.length() <= 65535) {
		encoded += (char)126;
		encoded += (char)((msg.length() >> 8) & 255);
		encoded += (char)(msg.length() & 255);
	}
	else {
		encoded += (char)127;
		encoded += (char)(((unsigned long long)msg.length() >> 56) & 255);
		encoded += (char)(((unsigned long long)msg.length() >> 48) & 255);
		encoded += (char)(((unsigned long long)msg.length() >> 40) & 255);
		encoded += (char)(((unsigned long long)msg.length() >> 32) & 255);
		encoded += (char)(((unsigned long long)msg.length() >> 24) & 255);
		encoded += (char)((msg.length() >> 16) & 255);
		encoded += (char)((msg.length() >> 8) & 255);
		encoded += (char)(msg.length() & 255);
	}

	//add the message content
	encoded += msg;

	return encoded;
}

std::string WSF::handshakeResponse(std::string msg) {
	std::string strSendMsg = "";
	int indKey = msg.find("Sec-WebSocket-Key:") + 19;
	int indLineEnd = msg.find("\r\n", indKey);
	std::string strKey = msg.substr(indKey, indLineEnd - indKey);

	SHA1 checksum;
	checksum.update(strKey + WS_MAGIC_STRING);
	std::string strHash = hexDecode(checksum.final());

	unsigned char arrHash[200] = { 0 };
	strcpy((char*)arrHash, strHash.c_str());
	strHash = base64Encode(arrHash, strHash.length());

	strSendMsg = "HTTP/1.1 101 Switching Protocols\r\n"
		"Upgrade: websocket\r\n"
		"Connection: Upgrade\r\n"
		"Sec-WebSocket-Accept: " + strHash + "\r\n"
		"\r\n";

	return strSendMsg;
}

//receive and send web socket handshake
void WSF::newConnection(SOCKET sock) {
	int n;
	char buffer[1024] = { 0 };
	n = recv(sock, buffer, 1023, 0);
	//n = read(sock, buffer, 255);
	if (n < 0) {
		std::cout << "ERROR reading from socket" << std::endl;
		return; //listen for new connections
	}

	std::string strHandshake = WSF::handshakeResponse(std::string(buffer));
	n = send(sock, strHandshake.c_str(), strHandshake.length(), 0);
	//send(sock, "HI", 2, 0);
	//n = write(sock, "I got your message", 18);

	if (n < 0) {
		std::cout << "ERROR writing to socket" << std::endl;
		return; //listen for new connections
	}
}

void WSF::newPHPRequest(SOCKET sock, json11::Json* phpData, int roomNum) {
	int n;

	char buffer[1024] = { 0 };
	n = recv(sock, buffer, 1023, 0);
	//n = read(sock, buffer, 255);

	if (n < 0) {
		std::cout << "ERROR reading from socket" << std::endl;
	}
	else {
		std::string strErr;
		std::string strJson = "{\"name\":\"IDEK\","
			"\"game\":1,"
			"\"players\":5,"
			"\"pass\":\"pika\"}";
		//(*phpData) = json11::Json::parse(strJson, strErr);
		(*phpData) = json11::Json::parse(std::string(buffer), strErr);

		//add room number and port to room Json
		json11::Json::object roomData = json11::Json::object((*phpData).object_items());
		roomData["room"] = roomNum;
		roomData["port"] = ROOM_PORT_START + roomNum;
		(*phpData) = json11::Json{ roomData };

		std::string strRoomData = (*phpData).dump();
		n = send(sock, strRoomData.c_str(), strRoomData.length(), 0);
		//send(sock, "HI", 2, 0);
		//n = write(sock, "I got your message", 18);

		if (n < 0) {
			std::cout << "ERROR writing to socket" << std::endl;
		}
	}

	//close sockets at the end
	closeSocket(sock);
}

//add all connections to socket queue
void WSF::listenConnections(ThreadQueue<SOCKET>* qSockets, int port, std::atomic<bool>* bExit) {
	struct sockaddr_in serv_addr;
	SOCKET sctListen = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

	if (sctListen < 0) {
		std::cout << "ERROR opening socket" << std::endl;
		std::cin.ignore();
		return;
	}

	/* Initialize socket structure */
	memset((char *)&serv_addr, 0, sizeof(serv_addr));

	serv_addr.sin_family = AF_INET;
	serv_addr.sin_addr.s_addr = INADDR_ANY; //inet_addr("127.0.0.1");
	serv_addr.sin_port = htons(port);

	/* Now bind the host address using bind() call.*/
	int iResult = bind(sctListen, (sockaddr*)&serv_addr, sizeof(serv_addr)) < 0;

	if (iResult == SOCKET_ERROR) {
		std::cout << "ERROR on binding" << std::endl;
		std::cin.ignore();
		return;
	}

	listen(sctListen, 5);

	struct sockaddr_in cli_addr;
#ifdef _WIN32
	int clilen = sizeof(cli_addr);
#else
    socklen_t clilen = sizeof(cli_addr);
#endif

	while (!*bExit) {
		SOCKET newConn = accept(sctListen, (sockaddr*)&cli_addr, &clilen);
		if (newConn != SOCKET_ERROR) {
			qSockets->push(newConn);
            std::cout << "GOOD CONN" << std::endl;
		}
        std::cout << "Connection" << std::endl;
	}

	closeSocket(sctListen);
}

void WSF::closeSocket(SOCKET sock) {
#ifdef _WIN32
	closesocket(sock);
#else
    close(sock);
#endif
}

//PRIVATE FUNCTIONS
//encode a binary char array into base64
std::string WSF::base64Encode(unsigned char const* charEncode, unsigned int length) {
	std::string ret;
	int i = 0;
	int j = 0;
	unsigned char arrChar3[3];
	unsigned char arrChar4[4];

	while (length--) {
		arrChar3[i++] = *(charEncode++);
		if (i == 3) {
			arrChar4[0] = (arrChar3[0] & 0xfc) >> 2;
			arrChar4[1] = ((arrChar3[0] & 0x03) << 4) + ((arrChar3[1] & 0xf0) >> 4);
			arrChar4[2] = ((arrChar3[1] & 0x0f) << 2) + ((arrChar3[2] & 0xc0) >> 6);
			arrChar4[3] = arrChar3[2] & 0x3f;

			for (i = 0; (i <4); i++)
				ret += BASE64_CHARS[arrChar4[i]];
			i = 0;
		}
	}

	if (i)
	{
		for (j = i; j < 3; j++)
			arrChar3[j] = '\0';

		arrChar4[0] = (arrChar3[0] & 0xfc) >> 2;
		arrChar4[1] = ((arrChar3[0] & 0x03) << 4) + ((arrChar3[1] & 0xf0) >> 4);
		arrChar4[2] = ((arrChar3[1] & 0x0f) << 2) + ((arrChar3[2] & 0xc0) >> 6);
		arrChar4[3] = arrChar3[2] & 0x3f;

		for (j = 0; (j < i + 1); j++)
			ret += BASE64_CHARS[arrChar4[j]];

		//padding
		while ((i++ < 3))
			ret += '=';
	}

	return ret;
}

//decode a hex string into binary
std::string WSF::hexDecode(std::string strIn) {
	int len = strIn.length();
	std::string strOut;
	for (int i = 0; i< len; i += 2)
	{
		std::string strByte = strIn.substr(i, 2);
		char c = (char)(int)strtol(strByte.c_str(), NULL, 16);
		strOut.push_back(c);
	}

	return strOut;
}