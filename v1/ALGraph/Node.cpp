#ifndef NODE_CPP
#define NODE_CPP
#include "Edge/Edge.cpp"
class Node{
public:
	string name;
	Edge *pEdge;
	bool isVisited;
	int popularity;
	string description;
	Node(string name, string desc, int popularity = 5){
		this->name = name;
		isVisited = false;
		pEdge = NULL;
		this->popularity = popularity;
		this->description = desc;
	};
	Node(){}
	void setNode(string name, string desc = "", int popularity = 5){
		this->name = name;
		this->description = desc;
		this->popularity = popularity;
	}		
};
#endif
