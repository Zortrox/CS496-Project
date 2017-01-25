/*Game server for communicating with the website, host screen,
and controllers*/

#include <iostream>
#include <string>

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

void doprocessing(SOCKET sock) {
	int n;
	char buffer[1024];
	memset(buffer, 0, 1024);
	n = recv(sock, buffer, 1023, 0);
	//n = read(sock, buffer, 255);

	if (n < 0) {
		perror("ERROR reading from socket");
		std::cin.ignore();
		exit(1);
	}

	printf("Here is the message: %s\n", buffer);
	n = send(sock, buffer, 1024, 0);
	//n = write(sock, "I got your message", 18);

	if (n < 0) {
		perror("ERROR writing to socket");
		std::cin.ignore();
		exit(1);
	}
}

int main(int argc, char *argv[]) {
	int portno, clilen;
	struct sockaddr_in serv_addr, cli_addr;

	WSADATA wsaData;
	WSAStartup(MAKEWORD(2, 2), &wsaData);

	/* First call to socket() function */
	//SOCK_DGRAM
	SOCKET sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

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

	/* Now start listening for the clients, here
	* process will go in sleep mode and will wait
	* for the incoming connection
	*/

	listen(sockfd, 5);
	clilen = sizeof(cli_addr);

	while (true) {
		SOCKET newsockfd = SOCKET_ERROR;
		while (newsockfd == SOCKET_ERROR) {
			newsockfd = accept(sockfd, (sockaddr*)&cli_addr, &clilen);
		}

		/* Create child process */
		std::thread child(doprocessing, newsockfd);
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