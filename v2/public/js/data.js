var nodes = [
{"name":"北门", popularity:8, isVisited: false},
{"name":"狮子山", popularity:6, isVisited: false},
{"name":"仙云石", popularity:10, isVisited: false},
{"name":"一线天", popularity:9, isVisited: false},
{"name":"飞流瀑", popularity:6.5, isVisited: false},
{"name":"仙武湖", popularity:7, isVisited: false},
{"name":"九曲桥", popularity:7, isVisited: false},
{"name":"观云台", popularity:9.5, isVisited: false}
];
var edges = [ 
				{ source: 0 , target: 2, dist:8, id:"edge1" },
			 	{ source: 0 , target: 1, dist:9, id:"edge2" },
	      { source: 1 , target: 4, dist:6, id:"edge3" }, 
	      { source: 1 , target: 3, dist:7, id:"edge4" },
	      { source: 3 , target: 7, dist:11, id:"edge5"}, 
	      { source: 4 , target: 7, dist:3, id:"edge6" },
	     	{ source: 2 , target: 6, dist:5, id:"edge7" }, 
	     	{ source: 2 , target: 5, dist:4, id:"edge8" }, 
	     	{ source: 5 , target: 6, dist:7, id:"edge9" }];
