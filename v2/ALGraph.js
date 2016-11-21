function ALGraph(){
	this.nodeArr = [];
	this.map = [];
	this.edgeCount = 0;
}

ALGraph.prototype.insertNode = function(name, desc, popularity){
		this.nodeArr.push({
				name: name,
				desc: desc,
				popularity: popularity,
				pEdge: null,
				isVisited: false
		});
};

ALGraph.prototype.insertEdge = function(begin, end, dist){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(this.nodeArr[i].name == begin){
			if(this.nodeArr[i].pEdge == null){
				this.nodeArr[i].pEdge = {
					nextNodeName: end,
					distance: dist,
					pNext: null
				}
			}else{
				let edge = this.nodeArr[i].pEdge;
				while(edge.pNext != null){
					edge = edge.pNext;
				}
				edge.pNext = {
					nextNodeName: end,
					distance: dist,
					pNext: null
				}
			}
		}
	}
};

ALGraph.prototype.insertUndirectedEdge = function(begin, end, dist){
	this.insertEdge(begin, end, dist);
	this.insertEdge(end, begin, dist);
	this.edgeCount++;
};

ALGraph.prototype.findNodeIndex = function(name){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(this.nodeArr[i].name == name){
			return i;
		}
	}
	return -1;
};

ALGraph.prototype.resetNodes = function(){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		this.nodeArr[i].isVisited = false;
	}
};

ALGraph.prototype.createGraph = function(){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		this.map.push([]);
		for(let j = 0; j < len; j++){
			if(i == j){
				this.map[i][j] = 0
			}else{
				this.map[i][j] = 32767;
			}
		}
	}
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		let edge = this.nodeArr[i].pEdge;
		while(edge != null){
			let index = this.findNodeIndex(edge.nextNodeName);
			this.map[i][index] = edge.distance;
			edge = edge.pNext;
		}
	}
	console.log("Create map successfully.");
};
ALGraph.prototype.outputGraph = function(){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		for(let j = 0; j < len; j++){
			console.log(this.map[i][j] + "\t");
		}
		console.log("\n");
	}
};

ALGraph.prototype.haveAllNodeVisited = function(){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(!this.nodeArr[i].isVisited){
			return false;
		}
	}
	return true;
}

ALGraph.prototype.DFSTraverse = function(index, res){
	if(this.nodeArr[index].isVisited == false){
		res.push(this.nodeArr[index].name);
		this.nodeArr[index].isVisited  = true;
	}else{
		return false;
	}
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(this.map[index][i] != 0 && this.map[index][i] != 32767){
			if(!this.nodeArr[i].isVisited){
				this.DFSTraverse(i, res);
				res.push(this.nodeArr[index].name);
			}
		}
	}
};

ALGraph.prototype.createTourSortGraphByDFS = function(beginNode){
	
	let res = [];
	let index = this.findNodeIndex(beginNode);
	if(index != -1){
		this.DFSTraverse(index, res);
	}
	this.resetNodes();
	return res;

};

ALGraph.prototype.BFSTraverse = function(index, res){
	res.push(this.nodeArr[index].name);
	this.nodeArr[index].isVisited = true;
	let queue = [];

	for(let i = 0, len = this.opacity; i < len; i++){
		if(this.map[index][i] != 0 && this.map[index][i] != 32767){
			if(!this.nodeArr[i].isVisited){
				res.push(this.nodeArr[i].name);	
				this.nodeArr[i].isVisited = true;
				res.push(this.nodeArr[index].name);
				queue.push(i);
			}
		}
	}

	for(let i = 0, len = queue.length; i < len; i++){
		this.BFSTraverse(queue[i], res);
		res.push(this.nodeArr[index].name);
	}

};

ALGraph.prototype.createTourSortGraphByBFS = function(beginNode){
	let res = [];
	let index = this.findNodeIndex(beginNode);
	if(index != -1){
		this.BFSTraverse(index, res);
	}
	this.resetNodes();
	return res;
}

ALGraph.prototype.getAdjMatrix = function(){
	return this.map;
};

ALGraph.prototype.getNodeName = function(index){
	return this.nodeArr[index].name;
}

ALGraph.prototype.shortestPath = function(beginNode){
	let res = [];
	let unselected = [];
	let selected = [];
	for(let i = 0; i < this.opacity; i++){
		selected[i] = 32767;
		unselected[i] = 32767;
	}
	let path = 0;
	let index = this.findNodeIndex(beginNode);
	while(path >= 0 && index >= 0){
		selected[index] = path;
		unselected[index] = -1;
		res.push({
			node: this.getNodeName(index),
			dist: selected[index],
			selected: true,
		})
		let edge = this.nodeArr[index].pEdge;
		while(edge != null){
			let idx = this.findNodeIndex(edge.nextNodeName);
			if(selected[idx] == 32767){
				let dist = edge.distance;
				unselected[idx] = (path + dist) < unselected[idx] ? (path + dist): unselected[idx];
				let min = 32767;
				res.push({
					node: this.getNodeName(idx),
					dist: unselected[idx],
					selected: false
				});
			}
			edge = edge.pNext;
		}
		let min = 32767;
		index = -1;
		for(let i = 0; i < this.opacity; i++){
			if(unselected[i] > 0 && min > unselected[i]){
				min = unselected[i];
				index = i;
			}
		}
		path = min;
	}
	return res;
};


ALGraph.prototype.outputKruskal = function(){
	let res = [];
	let vset = [];
	let edges = []
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		vset[i] = i;
	}
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		for(let j = 0; j < i; j++){
			if(this.map[i][j] != 32767 && this.map[i][j] != 0){
				edges.push({
					begin: i,
					end: j,
					dist: this.map[i][j]
				});
			}
		}
	}
	edges.sort(function(edge1, edge2){
		return edge1.dist - edge2.dist;
	});
	let count = 1, idx = 0;
	while(count < this.nodeArr.length && idx < edges.length){
		let sn1 = vset[edges[idx].begin];
		let sn2 = vset[edges[idx].end];
		if(sn1 != sn2){
			count++;
			res.push({
				begin: this.getNodeName(edges[idx].begin),
				end: this.getNodeName(edges[idx].end),
				dist: edges[idx].dist
			})
			for(let i = 0, len = vset.length; i < len; i++){
				if(vset[i] == sn1){
					vset[i] = sn2;
				}
			}
		}
		idx++;
	}	
	return res;
};
ALGraph.prototype.outputPrim = function(){
	let result = [];
	let index = Math.floor(Math.random() * this.nodeArr.length);
	let edges = [];
	while(!this.haveAllNodeVisited()){
		this.nodeArr[index].isVisited = true;
		let edge = this.nodeArr[index].pEdge;
		while(edge != null){
			edges.push({
				begin: this.nodeArr[index].name,
				end: edge.nextNodeName,
				dist: edge.distance
			});
			edge = edge.pNext;
		}
		while(!this.haveAllNodeVisited()){
			edges.sort(function(edge1, edge2){
				return edge1.dist - edge2.dist;
			});
			let e = edges[0];
			edges.splice(0, 1);
			if(!this.nodeArr[this.findNodeIndex(e.end)].isVisited){
				index = this.findNodeIndex(e.end);
				result.push(e);
				break;
			}
		}
	}
	this.resetNodes();
	return result;
}

ALGraph.prototype.sortByPopularity = function(){
	let data = this.nodeArr.slice(0);
	data.sort(function(node1, node2){
		return node1.popularity < node2.popularity;
	});
	let res = [];
	for(let i = 0, len = data.length; i < len; i++){
		res.push({
			name: data[i].name,
			popularity: data[i].popularity
		})
	}
	return res;
}

ALGraph.prototype.searchKeyword = function(keyword){
	let data = [];
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		let desc = this.nodeArr[i].desc;
		if(desc.indexOf(keyword) >= 0){
			data.push({
				name: this.nodeArr[i].name,
				popularity: this.nodeArr[i].popularity,
				desc: desc.replace(new RegExp((keyword),'g'), "<span style='color:#A254A2'>" + keyword + "</span>")
			})
		}
	}
	return data;
}


module.exports = ALGraph;










