#ifndef _CAR_H
#define _CAR_H
#include <queue>
#include <stack>
#include "CarInfo/CarInfo.cpp"
using namespace std;
class CarManagement{
private:
	queue<CarInfo> waitQueue;
	stack<CarInfo> park;
	stack<CarInfo> temp;
	int opacity;
	int carCount;
	int waitCount;
public:
	CarManagement(int opacity = 3);
	void createNewOrder();
	void deleteOrder();
};
#endif