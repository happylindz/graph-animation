#include "../Util/Util.cpp"
#include "ALGraph.h"

ALGraph::ALGraph(int opacity){

	this->opacity = opacity;
	nodeArr = new Node[opacity];
	nodeCount = 0;
	edgeCount = 0;
	map = new int*[opacity];

	for(int i = 0; i < opacity; i++){
		map[i] = new int[opacity];
	}

	for(int i = 0; i < opacity; i++){
		for(int j = 0; j < opacity; j++){
			map[i][j] = 32767;
			if(i == j){
				map[i][j] = 0;
			}
		}
	}

}

ALGraph::~ALGraph(){
	for(int i = 0; i < opacity; i++){
			delete[] map[i];
	}
	delete[] map;
	delete[] nodeArr;
}

void ALGraph::insertNode(string name, string desc, int popularity){
	if(nodeCount >= opacity){
		cout<<"insert too much node..."<<endl;
		return;
	}
	nodeArr[nodeCount++].setNode(name, desc, popularity);
}

void ALGraph::insertUndirectedEdge(string begin, string end, int distance){
	insertEdge(begin, end, distance);
	insertEdge(end, begin, distance);
}

void ALGraph::insertEdge(string begin, string end, int distance){
	int index = findNodeIndex(begin);
	Edge* edge = nodeArr[index].pEdge;
	if(edge == NULL){
		nodeArr[index].pEdge = new Edge(end, distance);
	}else{
		while(edge->getNext() != NULL){
			edge = edge->getNext();
		}
		Edge* newEdge = new Edge(end, distance);
		edge->setNext(newEdge);
	}
}

void ALGraph::createGraph(){
	for(int i = 0; i < opacity; i++){
		Edge *edge = nodeArr[i].pEdge;
		while(edge != NULL){
			int index = findNodeIndex(edge->getName());
			map[i][index] = edge->getDistance();
			edge = edge->getNext();
		}
	}
	cout<<"成功创建分布图"<<endl;
}

void ALGraph::outputGraph(){
	cout<<"\t";
	for(int i = 0; i < opacity; i++){
		cout<<nodeArr[i].name<<"\t";
	}
	cout<<endl;
	for(int i = 0; i < opacity; i++){
		cout<<nodeArr[i].name<<"\t";
		for(int j = 0; j < opacity; j++){
			cout<<map[i][j]<<"\t";
		}
		cout<<endl; 
	}
}

vector<string> ALGraph::createTourSortGraph(string beginNode){
	vector<string> res;
	int index = findNodeIndex(beginNode);
	DFSTraverse(index, res);
	cout<<"导游路线为:"<<res[0];
	for(int i = 1; i < res.size(); i++){
		cout<<"-->"<<res[i];
	}
	cout<<endl;
	resetNodes();
	return res;
}


bool ALGraph::DFSTraverse(int index, vector<string> &res){
		
	if (nodeArr[index].isVisited == false)
	{
		res.push_back(nodeArr[index].name);
		nodeArr[index].isVisited = true;
	}else{
		return false;
	}
	for(int i = 0; i < opacity; i++){
		if(map[index][i] != 0 && map[index][i] != 32767){
			bool isVisited;
			if(!nodeArr[i].isVisited){
				isVisited = DFSTraverse(i, res);
				if(!haveAllNodeVisited()){
					res.push_back(nodeArr[index].name);

				}
			}		
		}
	}
	return true;
}

int ALGraph::findNodeIndex(string name){
	for(int i = 0; i < opacity; i++){
		if (name == nodeArr[i].name)
		{
			return i;
		}
	}
	return -1;
}


bool ALGraph::haveAllNodeVisited(){
	for(int i = 0; i < opacity; i++){
		if(!nodeArr[i].isVisited){
			return false;
		}
	}
	return true;
}

void ALGraph::resetNodes(){
	for(int i = 0; i < opacity; i++){
		nodeArr[i].isVisited = false;
	}
}

void ALGraph::topoSort(string beginNodeName){
	int degrees[opacity];
	for(int i = 0; i < opacity; i++){
		degrees[i] = 0;
	}
	vector<string> res;
	DFSTraverse(findNodeIndex(beginNodeName), res);
	for(int i = 1; i < res.size(); i++){
		degrees[findNodeIndex(res[i])]++;
	}
	degrees[0] = 0;
	while(findDegreeIsZero(degrees) != -1){
		int idx = findDegreeIsZero(degrees);
		degrees[idx] = -1;
		for(int i = 0; i < opacity; i++){
			if(map[idx][i] != 0 && map[idx][i] != 32767){
				degrees[i] --;
			}
		}
	}
	vector<int> rounds;
	for(int i = 0; i < opacity; i++){
		if(degrees[i] > 0){
			rounds.push_back(i);
		}
	}
	if(rounds.size() == 0){
		cout<<"图中不存在回路。"<<endl;
	}else{
		cout<<"图中有回路, 回路为: "<<endl;
		for(int i = 0; i < rounds.size(); i++){
			cout<<nodeArr[rounds[i]].name<<"  ";
		}
	}
	cout<<endl;
	resetNodes();
}


int ALGraph::findDegreeIsZero(int degrees[]){
	for(int i = 0; i < opacity; i++){
		if(degrees[i] == 0){
			return i;
		}
	}
	return -1;
}

void ALGraph::shortestPath(string begin, string end){
	int unselected[opacity];
	int selected[opacity];
	for(int i = 0; i < opacity; i++){
		selected[i] = 32767;
		unselected[i] = 32767;
	}
	int path = 0;
	int index = findNodeIndex(begin);
	while(path >= 0 && index >= 0){
		if(index < opacity){
			selected[index] = path;
			unselected[index] = -1;
		}else{
			cout<<"输入错误"<<endl;
		}
		Edge* edge = nodeArr[index].pEdge;
		while(edge != NULL){
			int idx = findNodeIndex(edge->getName());
			int dist = edge->getDistance();
			unselected[idx] = (path + dist) < unselected[idx] ? (path + dist): unselected[idx];
			edge = edge->getNext();
		}
		int min = 32767;
		index = -1;
		for(int i = 0; i < opacity; i++){
			if(unselected[i] > 0 && min > unselected[i]){
				min = unselected[i];
				index = i;
			}
		}
		path = min;
	}
	index = findNodeIndex(end);
	cout<<"通过邻接表求得最短距离为: "<<selected[index]<<endl;
}

void ALGraph::outPutShortestPath(string begin, string end){
	int roads[opacity][opacity];
	int dist[opacity][opacity];

	for(int i = 0; i < opacity; i++){
		for(int j = 0; j < opacity; j++){
			roads[i][j] = j;
			dist[i][j] = map[i][j];
		}
	}

	for(int k = 0; k < opacity; k++){
		for(int i = 0; i < opacity; i++){
			for(int j = 0; j < opacity; j++){
				if(dist[i][k] + dist[k][j] < dist[i][j]){
					dist[i][j] = dist[i][k] + dist[k][j];
					roads[i][j] = roads[i][k];
				}
			}
		}
	}
	
	int index1 = findNodeIndex(begin);
	int index2 = findNodeIndex(end);
	cout<<"通过邻接矩阵求得最短距离:"<<dist[index1][index2]<<endl;
	cout<<"最短路径:"<<endl;
	while(index1 != index2){
		cout<<nodeArr[index1].name<<"-->";
		index1 = roads[index1][index2];
	}	
	cout<<nodeArr[index2].name<<endl;
}

void ALGraph::miniDistanse(string begin, string end){
	cout<<"Dijkstra算法:"<<endl;
	shortestPath(begin, end);
	cout<<"Floyd算法:"<<endl;
	outPutShortestPath(begin, end);
}


void ALGraph::prim(string start){
	vector<EData> results;
	vector<EData> s;
	int index = findNodeIndex(start);

	while(!haveAllNodeVisited()){
		nodeArr[index].isVisited = true;
		Edge* edge = nodeArr[index].pEdge;
		while(edge != NULL){
			EData e = EData(nodeArr[index].name, edge->getName(), edge->getDistance());
			s.push_back(e);
			edge = edge->getNext();
		}

		while(!haveAllNodeVisited()){
			int idx = -1;
			int min = 32767;
			for(int i = 0; i < s.size(); i++){
				if(min > s[i].weight){
					min = s[i].weight;
					idx = i;
				}
			}
			EData e = s[idx];
			s.erase(s.begin() + idx);
			if(!nodeArr[findNodeIndex(e.end)].isVisited){
				index = findNodeIndex(e.end);
				results.push_back(e);
				break;
			}
		}
	}
	outputPlanningMap(results);
	resetNodes();
}

void ALGraph::outputPlanningMap(vector<EData> results){
	cout<<"道路修建规划图:"<<endl;
	for(int i = 0; i < results.size(); i++){
		cout<<"从"<<results[i].start<<"到"<<results[i].end<<"修一条路"<<endl;
	}
}


void ALGraph::sort(){
	Node *res = new Node[opacity];
	for(int i = 0; i < opacity; i++){
		res[i].popularity = nodeArr[i].popularity;
		res[i].setNode(nodeArr[i].name);
	}
	quickSort(0, opacity - 1, res);
	cout<<"根据不同景点的受欢迎程度对景点进行快速排序:"<<endl;
	for(int i = 0; i < opacity; i++){
		cout<<(i + 1)<<". "<<res[i].name<<":"<<res[i].popularity<<endl;
	}
}

void ALGraph::searchKey(){
	cout<<"请输入你要查找的关键字:";
	string input;
	cin>>input;
	bool res[opacity];
	for(int i = 0; i < opacity; i++){
		res[i] = false;
	}
	for(int i = 0; i < opacity; i++){
		res[i] = searchKeywords(nodeArr[i].description, input);
	}
	bool isFind = false;
	cout<<"以下是搜寻的结果:"<<endl;
	for(int i = 0; i < opacity; i++){
		if(res[i]){
			cout<<nodeArr[i].name<<": "<<endl;
			cout<<"简介:"<<nodeArr[i].description<<endl;
			isFind = true;
		}
	}
	if(!isFind){
		cout<<"未能找到关键字"<<endl;
	}
}












