#ifndef CARINFO_H
#define CARINFO_H
class CarInfo{
private:
	int number;
	int arrTime;
public:
	CarInfo(int number, int arrTime);
	int getArrTime();
	void setArrTime(int arr);
	int getNumber();
	void setNumber(int n);
};
#endif
