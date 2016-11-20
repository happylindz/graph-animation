#include <string>
using namespace std;

class Edge{
public:
	int distance;
	string nextNodeName;
	Edge* pNext;
	Edge(string nextNodeName, int distance){
		this->nextNodeName = nextNodeName;
		this->distance = distance;
		pNext = NULL;
	}
	Edge(){
		pNext = NULL;
	}
};

