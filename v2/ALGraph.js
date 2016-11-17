function ALGraph(opacity){
	this.opacity = opacity;
	this.nodeArr = [];
	this.map = [];
	this.nodeCount = 0;
	this.edgeCount = 0;
	for(let i = 0; i < this.opacity; i++){
		this.map[i] = []
		for(let j = 0; j < this.opacity; j++){
			if(i == j){
				this.map[i][j] = 0;
			}else{
				this.map[i][j] = 32767;
			}
		}
	}
}

ALGraph.prototype.insertNode = function(name, desc, popularity){
	if(this.nodeCount < this.opacity){
		this.nodeArr.push({
				name: name,
				desc: desc,
				popularity: popularity,
				pEdge: null,
				isVisited: false
		});
		this.nodeCount++;
	}else{
		console.log("ALGraph cannot insert node");
	}
}

ALGraph.prototype.insertEdge = function(begin, end, dist){
	for(let i = 0; i < this.opacity; i++){
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
}

ALGraph.prototype.insertUndirectedEdge = function(begin, end, dist){
	this.insertEdge(begin, end, dist);
	this.insertEdge(end, begin, dist);
	this.edgeCount++;
}

ALGraph.prototype.findNodeIndex = function(name){
	for(let i = 0; i < this.opacity; i++){
		if(this.nodeArr[i].name == name){
			return i;
		}
	}
	return -1;
}

ALGraph.prototype.resetNodes = function(){
	for(let i = 0; i < this.opacity; i++){
		this.nodeArr[i].isVisited = false;
	}
}

ALGraph.prototype.createGraph = function(){
	for(let i = 0; i < this.opacity; i++){
		let edge = this.nodeArr[i].pEdge;
		while(edge != null){
			let index = this.findNodeIndex(edge.nextNodeName);
			this.map[i][index] = edge.distance;
			edge = edge.pNext;
		}
	}
	console.log("成功创建分布图");
};
ALGraph.prototype.outputGraph = function(){
	for(let i = 0, len = this.opacity; i < len; i++){
		for(let j = 0; j < len; j++){
			console.log(this.map[i][j] + "\t");
		}
		console.log("\n");
	}
}

ALGraph.prototype.haveAllNodeVisited = function(){
	let nodeArr = this.nodeArr;
	for(let i = 0, len = this.opacity; i < len; i++){
		if(!nodeArr[i].isVisited){
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
	for(let i = 0, len = this.opacity; i < len; i++){
		if(this.map[index][i] != 0 && this.map[index][i] != 32767){
			if(!this.nodeArr[i].isVisited){
				this.DFSTraverse(i, res);
				res.push(this.nodeArr[index].name);
			}
		}
	}
}

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

}

ALGraph.prototype.createTourSortGraphByBFS = function(beginNode){
	let res = [];
	let index = this.findNodeIndex(beginNode);
	if(index != -1){
		this.BFSTraverse(index, res);
	}
	this.resetNodes();
	return res;
}




module.exports = ALGraph;










