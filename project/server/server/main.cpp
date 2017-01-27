/*Game server for communicating with the website, host screen,
and controllers*/

//#include <stdio.h>
//#include <sys/types.h>
#include <stdlib.h>
#include <thread>

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN 1
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
//#include <windows.h>
#else
#include <sys/socket.h> // seen & definitely related to socket, structs defined inside
#include <netinet/in.h> // more structs defined, seems useful 
#include <netdb.h>      // no idea again :/
#endif

#include <iostream>
#include <string>
#include "sha1-master\sha1.hpp"
#include "threadqueue.h"

static const std::string WS_MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
static const std::string BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

//decode the WebSocket client message
std::string decodeMessage(std::string msg) {
	char secondByte = msg[1];

	int length = secondByte & 127;
	int indexFirstMask = 2;

	if (length == 126) indexFirstMask = 4;
	else if (length == 127)  indexFirstMask = 10;

	char masks[] = { msg[indexFirstMask], msg[indexFirstMask+1], msg[indexFirstMask+2], msg[indexFirstMask+3] };
	
	int indexFirstDataByte = indexFirstMask + 4;
	std::string decoded = "";

	for (size_t i = indexFirstDataByte, j = 0; i < msg.length(); i++, j++) {
		decoded += (char)(msg[i] ^ masks[j % 4]);
	}

	return decoded;	
}

//encodes the message to send to a WebSocket
std::string encodeMessage(std::string msg) {
	std::string encoded = "";

	//129 is a text message
	encoded += (char)129;

	//set the size of the message
	if (msg.length() <= 125) {
		encoded += (char)msg.length();
	} else if (msg.length() >= 126 && msg.length() <= 65535) {
		encoded += (char)126;
		encoded += (char)((msg.length() >> 8) & 255);
		encoded += (char)(msg.length() & 255);
	} else {
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

//encode a binary char array into base64
std::string base64Encode(unsigned char const* charEncode, unsigned int length) {
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
std::string hexDecode(std::string strIn) {
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

void newConnection(SOCKET sock) {
	int n;
	char buffer[1024] = { 0 };
	n = recv(sock, buffer, 1023, 0);
	//n = read(sock, buffer, 255);
	if (n < 0) {
		perror("ERROR reading from socket");
		std::cin.ignore();
		return; //listen for new connections
	}

	printf("Here is the message: %s\n", buffer);

	std::string strRecvMsg = std::string(buffer);
	std::string strSendMsg = "";
	int indKey = strRecvMsg.find("Sec-WebSocket-Key:") + 19;
	int indLineEnd = strRecvMsg.find("\r\n", indKey);
	std::string strKey = strRecvMsg.substr(indKey, indLineEnd - indKey);

	SHA1 checksum;
	checksum.update(strKey + WS_MAGIC_STRING);
	std::string strHash = hexDecode(checksum.final());
	
	unsigned char arrHash[200] = { 0 };
	strcpy_s((char*)arrHash, 200, strHash.c_str());
	strHash = base64Encode(arrHash, strHash.length());

	strSendMsg = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + strHash + "\r\n\r\n";
	n = send(sock, strSendMsg.c_str(), strSendMsg.length(), 0);
	//send(sock, "HI", 2, 0);
	//n = write(sock, "I got your message", 18);

	if (n < 0) {
		perror("ERROR writing to socket");
		std::cin.ignore();
		return; //listen for new connections
	}

	char buffer2[1024] = { 0 };
	n = recv(sock, buffer2, 1023, 0);
	std::string decoded = decodeMessage(buffer2);
	std::cout << "Here is the message: " << decoded << std::endl;

	std::string encoded = encodeMessage("test send msg");
	send(sock, encoded.c_str(), encoded.length(), 0);
}

int main(int argc, char *argv[]) {
	int portno, clilen;
	struct sockaddr_in serv_addr, cli_addr;

	WSADATA wsaData;
	WSAStartup(MAKEWORD(2, 2), &wsaData);

	/* First call to socket() function */
	//SOCK_DGRAM
	SOCKET sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	ThreadQueue<SOCKET> qSockets;

	if (sockfd < 0) {
		perror("ERROR opening socket");
		std::cin.ignore();
		exit(1);
	}

	/* Initialize socket structure */
	memset((char *)&serv_addr, 0, sizeof(serv_addr));
	portno = 2000;

	serv_addr.sin_family = AF_INET;
	serv_addr.sin_addr.s_addr = INADDR_ANY; //inet_addr("127.0.0.1");
	serv_addr.sin_port = htons(portno);

	/* Now bind the host address using bind() call.*/
	int iResult = bind(sockfd, (sockaddr*)&serv_addr, sizeof(serv_addr)) < 0;

	if (iResult == SOCKET_ERROR) {
		perror("ERROR on binding");
		std::cin.ignore();
		exit(1);
	}

	listen(sockfd, 5);
	clilen = sizeof(cli_addr);

	while (true) {
		SOCKET newsockfd = SOCKET_ERROR;
		while (newsockfd == SOCKET_ERROR) {
			qSockets.push(accept(sockfd, (sockaddr*)&cli_addr, &clilen));
		}

		/* Create child process */
		std::thread child(newConnection, newsockfd);
		child.detach();
	}

	#ifdef _WIN32
	closesocket(sockfd);
	WSACleanup();
	#else
	close(sockfd);
	#endif

	std::cin.ignore();

	return 0;
}