#pragma once

#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>

template <typename T>
class ThreadQueue
{
public:
	T pop() {
		std::unique_lock<std::mutex> mlock(m_mutex);
		while (m_queue.empty())
		{
			m_cond.wait(mlock);
		}
		auto item = m_queue.front();
		m_queue.pop();
		return item;
	}
	void pop(T& item) {
		std::unique_lock<std::mutex> mlock(m_mutex);
		while (m_queue.empty())
		{
			m_cond.wait(mlock);
		}
		item = m_queue.front();
		m_queue.pop();
	}
	void push(const T& item) {
		std::unique_lock<std::mutex> mlock(m_mutex);
		m_queue.push(item);
		mlock.unlock();
		m_cond.notify_one();
	}
	void push(T&& item) {
		std::unique_lock<std::mutex> mlock(m_mutex);
		m_queue.push(std::move(item));
		mlock.unlock();
		m_cond.notify_one();
	}

private:
	std::queue<T> m_queue;
	std::mutex m_mutex;
	std::condition_variable m_cond;
};