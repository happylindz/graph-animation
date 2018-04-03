

export default class ALGraph {
    constructor() {
        this.nodeArr = [];
        this.map = [];
        this.edgeCount = 0;
    }
    getData() {
        const data = {};
        data['nodes'] = this.nodeArr.map((node) => {
            return {
                "name": node.name,
                "popularity": node.popularity,
                "desc": node.desc,
                "path": "Infinity"
            };
        })
        data['edges'] = [];
        this.nodeArr.forEach((node) => {
            const source = node.name;
            if(node.pEdge !== null) {
                let edge = node.pEdge;
                let target = edge.nextNodeName;
                if(!data['edges'].some((edge) => {
                    return (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source);
                })) {
                    data['edges'].push({
                        source: source,
                        target: target,
                        dist: edge.distance,
                    });
                }
                while (edge.pNext !== null) {
                    edge = edge.pNext;
                    target = edge.nextNodeName;
                    if (!data['edges'].some((edge) => {
                        return (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source);
                    })) {
                        data['edges'].push({source: source, target: target, dist: edge.distance});
                    }
                }
            }
        })
        return data;
    }
    /**
     * 找到节点名对应数组中的下标
     * @param {string} name 节点名
     */
    getNodeIndex(name) {
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            if(this.nodeArr[i].name === name) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 获取邻接矩阵
     */
    getAdjMatrix() {
        return this.map;
    }
    /**
     * 判断起始点到终点对应的边是否存在
     * @param {int} bIndex 起始点索引
     * @param {int} eIndex 终点索引
     */
    hasEdgeExisted(bIndex, eIndex) {
        if(this.map[bIndex][eIndex] === Infinity || this.map[bIndex][eIndex] ===  0) {
            return false;
        }else {
            return true;
        }
    }
    /**
     * 判断所有节点是否已经被访问过了
     */
    haveAllNodesVisited() {
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            if(!this.nodeArr[i].isVisited) {
                return false;
            }
        }
        return true;
    }
    /**
     * 通过索引获取节点名
     * @param {int} index 索引
     */
    getNodeName(index) {
        return this.nodeArr[index].name;
    }
    /**
     * 将所有节点设置为未访问过
     */
    resetNodes() {
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            this.nodeArr[i].isVisited = false;
        }
    }
    /**
     * 插入节点
     * @param {string} name 节点名
     * @param {string} description 节点描述
     * @param {int} popularity 节点权重
     */
    insertNode(name, description, popularity) {
        const arr = [];
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            this.map[i].push(Infinity);
            arr.push(Infinity);
        }
        arr.push(0);
        this.map.push(arr);
        this.nodeArr.push({
            name: name,
            desc : description,
            popularity: parseInt(popularity) || 0,
            pEdge: null,
            isVisited: false,
        });
    }
    /**
     * 删除节点
     * @param {string} name 节点名
     */
    deleteNode(name) {
        const index = this.getNodeIndex(name);
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            this.map[i].splice(index, 1);
        }
        this.map.splice(index, 1);
        this.nodeArr.splice(index, 1);
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            if (this.nodeArr[i].pEdge === null) {
                continue;
            }
            if (this.nodeArr[i].pEdge.nextNodeName === name) {
                this.nodeArr[i].pEdge = this.nodeArr[i].pEdge.pNext;
            }else {
                let edge = this.nodeArr[i].pEdge;
                while(edge.pNext !== null) {
                    if(edge.pNext.nextNodeName === name) {
                        edge.pNext = edge.pNext.pNext;
                        break;
                    }
                    edge = edge.pNext;
                }
            }
        }
    }
    /**
     * 插入单边
     * @param {string} bName 起点名
     * @param {string} eName 终点名
     * @param {int} dist 距离
     */
    insertEdge(bName, eName, dist) {
        const bIndex = this.getNodeIndex(bName);
        const eIndex = this.getNodeIndex(eName);
        if(bIndex === -1 || eIndex === -1) {
            return;
        }
        this.map[bIndex][eIndex] = dist;
        if (this.nodeArr[bIndex].pEdge === null) {
            this.nodeArr[bIndex].pEdge = {
                nextNodeName: eName,
                distance: parseInt(dist),
                pNext: null,
            };
        }else {
            let edge = this.nodeArr[bIndex].pEdge;
            while(edge.pNext !== null) {
                edge = edge.pNext;
            }
            edge.pNext = {
                nextNodeName: eName,
                distance: parseInt(dist),
                pNext: null,
            };
        }
    }
    /**
     * 插入双边
     * @param {string} bName 起点名
     * @param {string} eName 终点名
     * @param {int} dist 距离
     */
    insertUndirectedEdge(bName, eName, dist) {
        this.insertEdge(bName, eName, dist);
        this.insertEdge(eName, bName, dist);
        this.edgeCount++;
    }
    /**
     * 删除单边
     * @param {string} bName 起点名
     * @param {string} eName 终点名
     */
    deleteEdge(bName, eName) {
        const bIndex = this.getNodeIndex(bName);
        const eIndex = this.getNodeIndex(eName);
        if (this.nodeArr[bIndex].pEdge === null) {
            return
        }
        if (this.nodeArr[bIndex].pEdge.nextNodeName === eName) {
            this.nodeArr[bIndex].pEdge = this.nodeArr[bIndex].pEdge.pNext;
        }else {
            let edge = this.nodeArr[bIndex].pEdge;
            while(edge.pNext !== null) {
                if(edge.pNext.nextNodeName === eName) {
                    edge.pNext = edge.pNext.pNext;
                    break;
                }
                edge = edge.pNext;
            }
        }
        this.map[bIndex][eIndex] = Infinity;
    }
    /**
     * 删除双边
     * @param {string} bName 起点名
     * @param {string} eName 终点名
     */
    deleteUndirectedEdge(bName, eName) {
        this.deleteEdge(bName, eName);
        this.deleteEdge(eName, bName);
        this.edgeCount--;
    }

    /**
     * 深度遍历图
     * @param {int} index 起点索引
     * @param {array} res 结果集合
     */
    DFSTraverse(index, res) {
        if(this.nodeArr[index].isVisited === false) {
            res.push({
                name: this.nodeArr[index].name,
            });
            this.nodeArr[index].isVisited = true;
        }else {
            return false;
        }
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            if(this.map[index][i] !== 0 && this.map[index][i] !== Infinity) {
                if(!this.nodeArr[i].isVisited) {
                    this.DFSTraverse(i, res);
                    res.push({
                        name: this.nodeArr[index].name,
                    });
                }
            }
        }
    }
    /**
     * 深度遍历遍历图
     * @param {string} beginName 起点名
     */
    createGraphByDFS(beginName) {
        const res = [];
        const index = this.getNodeIndex(beginName);
        if(index !== -1) {
            this.DFSTraverse(index, res);
        }
        this.resetNodes();
        return res;
    }
    /**
     * 广度遍历
     * @param {int} index 起点索引
     * @param {array} res 结果集
     */
    BFSTraverse(index, res) {
        const queue = [];
        let idx = -1;
        this.nodeArr[index].isVisited = true;
        queue.push(index);
        while(queue.length !== 0) {
            idx = queue.shift();
            res.push({
                name: this.nodeArr[idx].name,
                selected: true,
            });
            for(let i = 0, len = this.nodeArr.length; i < len; i++) {
                if(this.map[idx][i] !== 0 && this.map[idx][i] !== Infinity) {
                    if(!this.nodeArr[i].isVisited) {
                        this.nodeArr[i].isVisited = true;
                        res.push({
                            name: this.nodeArr[i].name,
                            selected: false,
                        });
                        queue.push(i);
                    }
                }
            }
        }
    }

    /**
     * 广度遍历遍历图
     * @param {string} beginName 起点名
     */
    createGraphByBFS(beginName) {
        const res = [];
        const index = this.getNodeIndex(beginName);
        if(index !== -1) {
            this.BFSTraverse(index, res);
        }
        this.resetNodes();
        return res;
    }
    /**
     * 最短路径算法
     * @param {string} beginName 起始名
     */
    shortestPath(beginName) {
        const res = [], unselected = [], selected = [];
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            selected[i] = Infinity;
            unselected[i] = Infinity;
        }
        let path = 0;
        let index = this.getNodeIndex(beginName);
        while(path >= 0 && index >= 0) {
            selected[index] = path;
            unselected[index] = -1;
            res.push({
                node: this.getNodeName(index),
                dist: selected[index],
                selected: true,
            });
            let edge = this.nodeArr[index].pEdge;
            while(edge !== null) {
                let idx = this.getNodeIndex(edge.nextNodeName);
                if(selected[idx] === Infinity) {
                    let dist = edge.distance;
                    unselected[idx] = (path + dist) < unselected[idx] ? (path + dist) : unselected[idx];
                    res.push({
                        node: this.getNodeName(idx),
                        dist: unselected[idx],
                        selected: false,
                    });
                }
                edge = edge.pNext;
            }
            let min = Infinity;
            index = -1;
            for(let i = 0, len = this.nodeArr.length; i < len; i++) {
                if(unselected[i] > 0 && min > unselected[i]) {
                    min = unselected[i];
                    index = i;
                }
            }
            path = min;
        }
        return res;
    }
    /**
     * Kruskal 算法实现
     */
    outputKruskal() {
        const res = [];
        const vset = [];
        const edges = []
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            vset[i] = i;
        }
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            for(let j = 0; j < i; j++) {
                if(this.map[i][j] !== Infinity && this.map[i][j] !== 0) {
                    edges.push({
                        begin: i,
                        end: j,
                        dist: this.map[i][j],
                    });
                }
            }
        }
        edges.sort((edge1, edge2) => {
            return edge1.dist - edge2.dist;
        });
        let count = 1, idx = 0;
        while(count < this.nodeArr.length && idx < edges.length) {
            let sn1 = vset[edges[idx].begin];
            let sn2 = vset[edges[idx].end];
            if(sn1 !== sn2) {
                count++;
                res.push({
                    begin: this.getNodeName(edges[idx].begin),
                    end: this.getNodeName(edges[idx].end),
                    dist: edges[idx].dist,
                });
                for(let i = 0, len = vset.length; i < len; i++) {
                    if(vset[i] === sn1) {
                        vset[i] = sn2;
                    }
                }
            }
            idx++;
        }
        return res;
    }
    /**
     * Prim 算法实现
     */
    outputPrim() {
        const res = [];
        let index = 0;
        const edges = [];
        while(!this.haveAllNodesVisited()) {
            this.nodeArr[index].isVisited = true;
            let edge = this.nodeArr[index].pEdge;
            while(edge !== null) {
                edges.push({
                    begin: this.nodeArr[index].name,
                    end: edge.nextNodeName,
                    dist: edge.distance,
                });
                edge = edge.pNext;
            }

            while(!this.haveAllNodesVisited()) {
                edges.sort((edge1, edge2) => {
                    return edge1.dist - edge2.dist;
                });
                if(edges.length === 0) {
                    return res;
                }
                const e = edges[0];
                edges.splice(0, 1);
                if(!this.nodeArr[this.getNodeIndex(e.end)].isVisited) {
                    index = this.getNodeIndex(e.end);
                    res.push(e);
                    break;
                }
            }

        }
        this.resetNodes();
        return res;
    }
    /**
     * 按照节点权重进行排序
     */
    sortByPopularity() {
        const data = this.nodeArr.slice(0);
        data.sort((node1, node2) => {
            return node1.popularity < node2.popularity;
        });
        const res = [];
        for(let i = 0, len = data.length; i < len; i++) {
            res.push({
                name: data[i].name,
                popularity: data[i].popularity,
            });
        }
        return res;
    }
    /**
     * 搜索关键词
     * @param {string} keyword 关键词
     */
    searchKeyword(keyword) {
        const data = [];
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            let desc = this.nodeArr[i].desc;
            if(desc.indexOf(keyword) >= 0) {
                data.push({
                    name: this.nodeArr[i].name,
                    popularity: this.nodeArr[i].popularity,
                    desc: desc.replace(new RegExp(keyword, 'g'), "<span style='color:#A254A2'>" + keyword + "</span>"),
                });
            }
        }
        return data;
    }
    /**
     * 获取所有节点
     */
    getNodes() {
        const data = this.nodeArr.map((node) => {
            return {
                name: node.name,
                desc: node.desc,
                popularity: node.popularity,
                path: Infinity,
            };
        })
        return data;
    }
    /**
     * 获取所有边
     */
    getEdges() {
        const data = [];
        for(let i = 0, len = this.nodeArr.length; i < len; i++) {
            for(let j = 0; j < i; j++) {
                if(this.map[i][j] !== 0 && this.map[i][j] !== Infinity) {
                    data.push({
                        source: this.getNodeName(i),
                        target: this.getNodeName(j),
                        dist: this.map[i][j],
                    });
                }
            }
        }
        return data;
    }

}