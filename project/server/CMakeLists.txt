cmake_minimum_required(VERSION 3.6)
project(server)

set(CMAKE_CXX_STANDARD 11)

set(SOURCE_FILES
        server/json11-master/json11.cpp
        server/json11-master/json11.hpp
        server/sha1-master/sha1.cpp
        server/sha1-master/sha1.hpp
        server/GameRoom.cpp
        server/GameRoom.h
        server/main.cpp
        server/makefile
        server/ThreadQueue.hpp
        server/WebSocketFunctions.cpp
        server/WebSocketFunctions.h
        test-site.html
        test-site.php)

add_executable(server ${SOURCE_FILES})
target_link_libraries(server ws2_32)