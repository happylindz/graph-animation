#include "CarInfo.h"

CarInfo::CarInfo(int number, int arrTime){
	this->number = number;
	this->arrTime = arrTime;	
}

int CarInfo::getArrTime(){
	return arrTime;
}

void CarInfo::setArrTime(int arr){
		arrTime = arr;
}

int CarInfo::getNumber(){
	return number;
}

void CarInfo::setNumber(int n){
	number = n;
}



