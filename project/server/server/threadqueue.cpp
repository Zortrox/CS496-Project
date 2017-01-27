#include "threadqueue.h"

template <typename T>
ThreadQueue<T>::ThreadQueue() {

}

template <typename T>
ThreadQueue<T>::~ThreadQueue() {

}

template <typename T>
T ThreadQueue<T>::pop() {
	std::unique_lock<std::mutex> mlock(m_mutex);
	while (m_queue.empty())
	{
		m_cond.wait(mlock);
	}
	auto item = m_queue.front();
	m_queue.pop();
	return item;
}

template <typename T>
void ThreadQueue<T>::pop(T& item) {
	std::unique_lock<std::mutex> mlock(m_mutex);
	while (m_queue.empty())
	{
		m_cond.wait(mlock);
	}
	item = m_queue.front();
	m_queue.pop();
}

template <typename T>
void ThreadQueue<T>::push(const T& item) {
	std::unique_lock<std::mutex> mlock(m_mutex);
	m_queue.push(item);
	mlock.unlock();
	m_cond.notify_one();
}

template <typename T>
void ThreadQueue<T>::push(T&& item) {
	std::unique_lock<std::mutex> mlock(m_mutex);
	m_queue.push(std::move(item));
	mlock.unlock();
	m_cond.notify_one();
}