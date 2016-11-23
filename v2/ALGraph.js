function ALGraph(){
	this.nodeArr = [];
	this.map = [];
	this.edgeCount = 0;
	console.log("Create map successfully.");
}


ALGraph.prototype.findNodeIndex = function(name){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(this.nodeArr[i].name == name){
			return i;
		}
	}
	return -1;
};
ALGraph.prototype.findEdge = function(bIndex, eIndex){
	if(this.map[bIndex][eIndex] == 32767 || this.map[bIndex][eIndex] == 0){
		return false;
	}else{
		return true;
	}
}

ALGraph.prototype.getNodeName = function(index){
	return this.nodeArr[index].name;
};

ALGraph.prototype.resetNodes = function(){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		this.nodeArr[i].isVisited = false;
	}
};

ALGraph.prototype.haveAllNodeVisited = function(){
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(!this.nodeArr[i].isVisited){
			return false;
		}
	}
	return true;
};

ALGraph.prototype.getAdjMatrix = function(){
	return this.map;
};

ALGraph.prototype.insertNode = function(name, desc, popularity){
	let arr = []
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		this.map[i].push(32767);
		arr.push(32767);
	}
	arr.push(0);
	this.map.push(arr);
	this.nodeArr.push({
			name: name,
			desc: desc,
			popularity: parseInt(popularity),
			pEdge: null,
			isVisited: false
	});
};
ALGraph.prototype.deleteNode = function(name){
	let index = this.findNodeIndex(name);
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		this.map[i].splice(index, 1);
	}
	this.map.splice(index, 1);
	this.nodeArr.splice(index, 1);
}

ALGraph.prototype.insertEdge = function(begin, end, dist){
	let bIndex = this.findNodeIndex(begin);
	let eIndex = this.findNodeIndex(end);
	this.map[bIndex][eIndex] = dist;
	if(this.nodeArr[bIndex].pEdge == null){
		this.nodeArr[bIndex].pEdge = {
			nextNodeName: end,
			distance: parseInt(dist),
			pNext: null
		}
	}else{
		let edge = this.nodeArr[bIndex].pEdge;
		while(edge.pNext != null){
			edge = edge.pNext;
		}
		edge.pNext = {
			nextNodeName: end,
			distance: parseInt(dist),
			pNext: null
		}
	}
};

ALGraph.prototype.insertUndirectedEdge = function(begin, end, dist){
	this.insertEdge(begin, end, dist);
	this.insertEdge(end, begin, dist);
	this.edgeCount++;
};

ALGraph.prototype.deleteEdge = function(begin, end){

	let bIndex = this.findNodeIndex(begin);
	let eIndex = this.findNodeIndex(end);

	if(this.nodeArr[bIndex].pEdge.nextNodeName == end){
		this.nodeArr[bIndex].pEdge = this.nodeArr[bIndex].pEdge.pNext;
	}else{
		let edge = this.nodeArr[bIndex].pEdge;
		while(edge.pNext != null){
			if(edge.pNext.nextNodeName == end){
				edge.pNext = edge.pNext.pNext;
				break;
			}
			edge = edge.pNext;
		}
	}
	this.map[bIndex][eIndex] = 32767;
}

ALGraph.prototype.deleteUndirectedEdge = function(begin, end){
	this.deleteEdge(begin, end);
	this.deleteEdge(end, begin);
	this.edgeCount--;
}

ALGraph.prototype.DFSTraverse = function(index, res){
	console.log(this.nodeArr[index]);
	if(this.nodeArr[index].isVisited == false){
		res.push({
			name: this.nodeArr[index].name
		});
		this.nodeArr[index].isVisited  = true;
	}else{
		return false;
	}
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		if(this.map[index][i] != 0 && this.map[index][i] != 32767){
			if(!this.nodeArr[i].isVisited){
				this.DFSTraverse(i, res);
				res.push({
					name: this.nodeArr[index].name
				});
			}
		}
	}
};

ALGraph.prototype.getMaximumLoop = function(name){
	let data = [];
	if(this.nodeArr.length == 0){
		return data;
	}
	let index = this.findNodeIndex(name);
	if(index != -1){
		this.DFSTraverse(index, data);
	}else{
		return [];
	}
	this.resetNodes();
	let max = -1;
	let res;
	for(let i = 1, len = data.length; i < len; i++){
		let idx = i - 1;
		while(idx > 0){
			if(data[idx].name == data[i].name){
				idx = idx + 1;
				break;
			}
			idx --;
		}
		for(let j = idx; j < i; j++){
			let bIndex = this.findNodeIndex(data[i].name);
			let eIndex = this.findNodeIndex(data[j].name);
			let beforeIndex = this.findNodeIndex(data[i - 1].name);
			if(this.map[bIndex][eIndex] != 32767 && this.map[bIndex][eIndex] != 0 && beforeIndex != eIndex){
				res = data.slice(j, i + 1);
				return res;
			}
		}
	}
	return [];
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
	let queue = [];
	this.nodeArr[index].isVisited = true;
	queue.push(index);
	while(queue.length != 0){
		let idx = queue.shift();
		res.push({
			name: this.nodeArr[idx].name,
			selected: true
		});
		for(let i = 0, len = this.nodeArr.length; i < len; i++){
			if(this.map[idx][i] != 0 && this.map[idx][i] != 32767){
				if(!this.nodeArr[i].isVisited){
					this.nodeArr[i].isVisited = true;
					res.push({
						name: this.nodeArr[i].name,
						selected: false
					});
					queue.push(i);
				}
			}
		}
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

ALGraph.prototype.shortestPath = function(beginNode){
	let res = [];
	let unselected = [];
	let selected = [];
	for(let i = 0, len = this.nodeArr.length; i < len ; i++){
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
		for(let i = 0, len = this.nodeArr.length; i < len; i++){
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
};

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
};

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
};


ALGraph.prototype.getNodes = function(){
	let data = [];
	this.nodeArr.forEach( function(node, index) {
		data.push({
			name: node.name,
			desc: node.desc,
			popularity: node.popularity,
			path: 32767
		});
	});
	return data;
}

ALGraph.prototype.getEdges = function(){
	let data = [];
	for(let i = 0, len = this.nodeArr.length; i < len; i++){
		for(let j = 0; j < i; j++){
			if(this.map[i][j] != 0 && this.map[i][j] != 32767){
				let begin = this.getNodeName(i);
				let end = this.getNodeName(j);
				data.push({
					source: begin,
					target: end,
					dist: this.map[i][j]
				});
			}
		}
	}
	return data;
}




module.exports = ALGraph;










