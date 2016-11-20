#include "Edge.h"

Edge::Edge(string nextNodeName, int distance){
	this->nextNodeName = nextNodeName;
	this->distance = distance;
	pNext = NULL;
}

Edge::Edge(){
	pNext = NULL;
}


int Edge::getDistance(){
	return distance;
}

void Edge::setDistance(int dist){
	distance = dist;
}

string Edge::getName(){
	return nextNodeName;
}


void Edge::setName(string name){
	nextNodeName = name;
}


Edge* Edge::getNext(){
	return pNext;
}

void Edge::setNext(Edge* next){
	pNext = next;
}

