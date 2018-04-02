#include "CarManagement.h"
#include <iostream>
using namespace std;

CarManagement::CarManagement(int opacity){
	this->opacity = opacity;
	carCount = 0;
	waitCount = 0;
}

void CarManagement::createNewOrder(){
	int number;
	cout<<"车牌号为:";
	cin>>number;
	int hour, minute;
	cout<<"进场的时刻:"<<endl;
	cout<<"小时:";
	cin>>hour;
	cout<<"分钟:";
	cin>>minute;
	CarInfo c = CarInfo(number, hour * 100 + minute);
	if(carCount < opacity){
		carCount++;
		park.push(c);
		cout<<"该车已进入停车场在: "<<carCount<<" 号车道"<<endl;
	}else{
		waitQueue.push(c);
		cout<<"停车场已满，该车已在便道上，"<<"前面共有 "<<waitCount<<" 辆车正在等待"<<endl;
		waitCount++;
	}
}

void CarManagement::deleteOrder(){
	int number;
	cout<<"车牌号为:";
	cin>>number;
	int hour, minute;
	cout<<"离场的时刻:"<<endl;
	cout<<"小时:";
	cin>>hour;
	cout<<"分钟:";
	cin>>minute;
	bool findCar = false;
	int expense;
	bool findCarv2 = false;
	while(park.size() != 0){
		CarInfo c = park.top();
		park.pop();
		if(number == c.getNumber()){
			carCount--;
			expense = (hour + 1 - c.getArrTime() / 100) * 6;
			findCar = true;
			break;
		}
		temp.push(c);
	}
	while(temp.size() != 0){
		park.push(temp.top());
		temp.pop();
	}
	if(findCar){
		while(carCount < opacity && waitCount > 0){
			CarInfo c = waitQueue.front();
			waitQueue.pop();
			c.setArrTime(hour * 100 + minute);
			park.push(c);
			carCount++;
			waitCount--;
		}
		cout<<"车牌号为:"<<number<<" 的车已成功离开车场，停车"<<(expense / 6)<<"小时, 共花费"<<expense<<"元"<<endl;
	}else{
		while(waitQueue.size() != 0){
			CarInfo c = waitQueue.front();
			waitQueue.pop();
			if(number == c.getNumber()){
				waitCount--;
				findCarv2 = true;
				break;
			}
			temp.push(c);
		}
		while(temp.size() != 0){
			waitQueue.push(temp.top());
			temp.pop();
		}
	}			
	if(!findCar && !findCarv2){
		cout<<"输入有误，找不到该车。"<<endl;
	}else if(findCarv2){
		cout<<"该车一直停在便道上，未能进入停车场，故不收费"<<endl;
	}
}



