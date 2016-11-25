#ifndef ALGRAPH_H
#define ALGRAPH_H
#include "Node.cpp"
#include "EData.cpp"
#include <vector>

class ALGraph{
public:
	ALGraph(int opacity);
	~ALGraph();

	void insertNode(string name, string desc, int popularity);              //创建顶点
	void insertUndirectedEdge(string begin, string end, int distance);      //创建无向边
	void insertEdge(string begin, string end, int distance);                //创建有向边

	void createGraph();                                                     //通过邻接表创建邻接矩阵
	void outputGraph();                                                     //输出邻接矩阵

	vector<string> createTourSortGraph(string beginNode);                   //创建导游路线图
	bool DFSTraverse(int index, vector<string> &res);                       //深度优先搜索
	int findNodeIndex(string name);                                         //查找某个节点对应的索引值
	bool haveAllNodeVisited();                                              //判断所有顶点是否已经全部访问过     
	void resetNodes();                                                      //将所有顶点重置为未访问过

	void topoSort(string beginNodeName);                                    //拓扑排序
	int findDegreeIsZero(int degrees[]);                                    //查找入度为 0 的节点

	void shortestPath(string begin, string end);                            //通过邻接表实现 dijkstra 算法求最短距离
	void outPutShortestPath(string begin, string end);                      //通过邻接矩阵实现 floyd 算法求最短路径

	void miniDistanse();                          												  //最小生成树业务逻辑
	void prim(string start);																								//Prim 算法具体实现
	void outputPlanningMap(vector<EData> results);													//输出 Prim 算法规划路线图的结果

	void sort();																														//快速排序对景区进行排序
	void searchKey();    																									  //搜索关键字

private:
	int opacity;	
	Node *nodeArr;
	int nodeCount;
	int edgeCount;
	int **map;
};

#endif
