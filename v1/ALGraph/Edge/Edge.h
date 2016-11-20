#ifndef EDGE_H
#define EDGE_H

#include <string>
using namespace std;

class Edge{
private:
	int distance;
	string nextNodeName;
	Edge* pNext;
public:
	Edge(string nextNodeName, int distance);
	Edge();
	int getDistance();
	void setDistance(int dist);
	string getName();
	void setName(string name);
	Edge* getNext();
	void setNext(Edge* next);
};

#endif

