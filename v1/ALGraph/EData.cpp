#include <iostream>
using namespace std;

class EData{
public:
	string start;
	string end;
	int weight;
	EData(){
	}
	EData(string s, string e, int w):start(s), end(e), weight(w){
	}
};
