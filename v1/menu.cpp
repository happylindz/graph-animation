
#include <iostream>
#include "CarManagement/CarManagement.cpp"
#include "ALGraph/ALGraph.cpp"
using namespace std;

ALGraph initData(){
	ALGraph g = ALGraph(8);
	g.insertNode("北门", "北门和五指峡是两个不同的气候带。良好的气候条件使北门水丰草美，物产丰富。北门瀑布以它震耳的轰鸣声中，飞溅的瀑布，给人以强烈的冲击。", 10);
	g.insertNode("狮子山", "狮子山也曾是古代中原与上党太行交往的一条必经的险道，它因道路狭窄，盘垣似羊肠而得名。", 3);
	g.insertNode("仙云石", "清代它被洪水冲跨，康熙年间人们捐资重新修建了古栈道，共砌了一千三百个台阶，如今已被荫林公路所取代，它现在只是十八盘一个重要的风景旅游点。", 6);
	g.insertNode("一线天", "位于太行山南脉林州市境内，全长50公里，被誉为“东方的科罗拉多”。一线天景区又名“百里画廊”。", 8);
	g.insertNode("飞流瀑", "位于太行山半腰，海拔1700余米。飞流瀑四面诸峰如笋。谷上悬崖百丈，荆棘丛生。谷的西南山顶有一飞瀑高悬，深渊浅潭，清澈可鉴，水美之处竟与九寨沟中“海子”相似，此处春时山花怒放，夏时绿草如茵，秋时满山红叶。", 7);
	g.insertNode("仙武湖", "公园的景点主要集中在仙武湖上，仙武湖距山西壶关县城东南60公里，因山有紫气缭绕成团而得名。山区万峰突兀，方圆百里。", 9);
	g.insertNode("九曲桥", "九曲桥景区以九曲桥为中心，位在仙武湖区树掌镇神郊村。宫内供奉着乐氏二仙女，又称“二仙奶奶庙”、“二圣庙”。", 4);
	g.insertNode("观云台", "是紫微道人面壁之处。洞如迷宫，宽窄不等，最高处达50余米，最宽处达30余米，最低窄处则仅容一人侧身而入。洞中有“天神”、“罗汉”、“ 八仙过海”、“玉龙捧寿”等溶岩层景点151处，已开发1500米，接待各方宾客。", 5);
	g.insertUndirectedEdge("北门", "仙云石", 8);
	g.insertUndirectedEdge("北门", "狮子山", 9);
	g.insertUndirectedEdge("狮子山", "飞流瀑", 6);
	g.insertUndirectedEdge("狮子山", "一线天", 7);
	g.insertUndirectedEdge("一线天", "观云台", 11);
	g.insertUndirectedEdge("飞流瀑", "观云台", 3);
	g.insertUndirectedEdge("仙云石", "九曲桥", 5);
	g.insertUndirectedEdge("仙云石", "仙武湖", 4);
	g.insertUndirectedEdge("仙武湖", "九曲桥", 7);
	return g;
}


void parkManagement(){
	CarManagement cm = CarManagement(2);
	cout<<"           "<<"** 停车场管理程序 **"<<"          "<<endl;
	cout<<"=============================================="<<endl;
	cout<<"**                                          **"<<endl;
	cout<<"**   A --- 汽车 进车场   D --- 汽车 出车场  **"<<endl;
	cout<<"**                                          **"<<endl;
	cout<<"**            E --- 退出 程序               **"<<endl;
	cout<<"=============================================="<<endl;
	while(true){
		cout<<"请选择:<A, D, E>:";
		string input;
		cin>>input;
		if(input == "A"){
			cm.createNewOrder();
		}else if(input == "D"){
			cm.deleteOrder();
		}else if(input == "E"){
			cout<<"你已成功退出停车场管理程序"<<endl;
			break;
		}else{
			cout<<"你的输入有误，请重新输入"<<endl;
		}
	}
}


void menu(){
	ALGraph g = initData();
	cout<<"=============================="<<endl;
	cout<<"    欢迎使用景区信息管理系统     "<<endl;
	cout<<"       ***请选择菜单***        "<<endl;
	while(true){
		cout<<"=============================="<<endl;
		cout<<"1、创建景区景点分布图。"<<endl;
		cout<<"2、输出景区景点分布图。"<<endl;
		cout<<"3、输出导游线路图。"<<endl;
		cout<<"4、输出导游线路图中的回路。"<<endl;
		cout<<"5、求两个景点间的最短路径和最短距离。"<<endl;
		cout<<"6、输出道路修建规划图。"<<endl;
		cout<<"7、查找关键字。"<<endl;
		cout<<"8、对景点进行排序。"<<endl;
		cout<<"9、停车场车辆进出记录信息。"<<endl;
		cout<<"10、退出系统。"<<endl;
		cout<<"请选择:";
		int input;
		cin>>input;
		switch(input){
			case 1:
				g.createGraph();
				break;
			case 2:
				g.outputGraph();
				break;
			case 3:
				g.createTourSortGraph("北门");
				break;
			case 4:
				g.topoSort("北门");
				break;
			case 5:

				g.miniDistanse();
				break;
			case 6:
				g.prim("北门");
				break;
			case 7:
				g.searchKey();
				break;
			case 8:
				g.sort();
				break;
			case 9:
				parkManagement();
				break;
			case 10:
				cout<<"你已经成功退出。";
				exit(0);
				break;
			default:
				cout<<"你输入有误，请重新输入。"<<endl;
				break;
		}

	}
}

