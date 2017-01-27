#pragma once

#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>

template <typename T>
class ThreadQueue
{
public:
	ThreadQueue();
	~ThreadQueue();

	T pop();
	void pop(T& item);
	void push(const T& item);
	void push(T&& item);

private:
	std::queue<T> m_queue;
	std::mutex m_mutex;
	std::condition_variable m_cond;
};