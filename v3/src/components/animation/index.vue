<template>
    <div id="animation">
    </div>
</template>

<script>
import Graph from './graph';
import ALGraph from '../../util/ALGraph'
import { readData, saveData } from '../../util/localData';
export default {
    name: 'animation',
    props: ['handleMenu'],
    mounted() {
        let nodes = null, edges = null;
        const data = readData();
        console.log(data);
        if(data.current) {
            nodes = data.current.nodes;
            edges = data.current.edges;
        }else {
            nodes = data.default.nodes;
            edges = data.default.edges;
        }
        this.nodes = nodes;
        this.edges = edges;
        // 底层算法支撑
        this.initMap(nodes, edges);

        // 视图创建
        this.initView(nodes, edges);
        window.onbeforeunload = () => {
            saveData(this.nodes, this.edges);
        };
    },
    methods: {
        resetNodes() {
            const animation = document.getElementById('animation');
            animation.innerHTML = '';
            const data = readData();
            if(data.default) {
                const {nodes, edges } = data.default;
                this.nodes = nodes;
                this.edges = edges;
                this.initMap(nodes, edges);
                this.initView(nodes, edges);
            }
        },
        successMessage(message) {
            this.$message({
                message: message,
                type: 'success',
            });
        },
        errorMessage(message) {
            this.$message.error(message);
        },
        initMap(nodes, edges) {
            const g = new ALGraph();
            nodes.forEach(function(node) {
                g.insertNode(node.name, node.desc, node.popularity);
            })
            edges.forEach(function(edge) {
                g.insertUndirectedEdge(edge.source, edge.target, edge.dist);
            });
            this.alGraph = g;
        },
        initView(nodes, edges) {
            const graph = new Graph(JSON.parse(JSON.stringify(nodes)), JSON.parse(JSON.stringify(edges)));
            graph.drawing();
            this.graph = graph;
        },
        resetStyle() {
            this.graph.resetStyle();
        },
        addNode(options) {
            const { name, desc, popularity } = options;
            const index = this.alGraph.getNodeIndex(name);
            if(index === -1){
                this.successMessage(`${name}节点添加成功`);
                this.handleMenu();
                this.alGraph.insertNode(name, desc, popularity);
                this.graph.insertNode(name, desc, popularity);
                this.nodes.push({
                    name, desc, popularity, path: "Infinity",
                })
            }else{
                this.errorMessage(`${name}节点已经存在了，请勿重复添加`);
            }
        },
        deleteNode(options) {
            const { name } = options;
            const index = this.alGraph.getNodeIndex(name);
            if(index === -1) {
                this.errorMessage(`找不到${name}节点`);
            }else {
                this.nodes = this.nodes.filter((node) => {
                    return node.name !== name;
                })
                this.successMessage(`${name}节点删除成功`);
                this.handleMenu();
                this.alGraph.deleteNode(name);
                this.graph.deleteNode(name);   
            }
        },
        addEdge(options) {
            const { begin, end, dist } = options;
            const bIndex = this.alGraph.getNodeIndex(begin);
            const eIndex = this.alGraph.getNodeIndex(end);
            if(bIndex === -1) {
                this.errorMessage(`${begin}节点不存在，无法添加边`);
            }else if(eIndex === -1) {
                this.errorMessage(`${end}节点不存在，无法添加边`);
            }else {
                if(this.alGraph.hasEdgeExisted(bIndex, eIndex)) {
                    this.errorMessage(`${begin}-${end}边已经存在，无法重复`);
                }else {
                    this.successMessage(`添加${begin}-${end}边成功`);
                    this.handleMenu();
                    this.alGraph.insertUndirectedEdge(begin, end, dist);
                    this.graph.insertEdge(begin, end, dist);
                    this.edges.push({
                        source: begin, target: end, dist,
                    })
                }
            }
        },
        deleteEdge(options) {
            const { begin, end } = options;
            const bIndex = this.alGraph.getNodeIndex(begin);
            const eIndex = this.alGraph.getNodeIndex(end);
            if(bIndex === -1) {
                this.errorMessage(`${begin}节点不存在，无法添加边`);
            }else if(eIndex === -1) {
                this.errorMessage(`${end}节点不存在，无法添加边`);
            }else {
                if(this.alGraph.hasEdgeExisted(bIndex, eIndex)) {
                    this.successMessage(`删除${begin}-${end}边成功`);
                    this.handleMenu();
                    this.alGraph.deleteUndirectedEdge(begin, end);
                    this.graph.deleteEdge(begin, end);
                    this.edges = this.edges.filter((edge) => {
                        return !(edge.target === end && edge.source === begin)
                    });
                }else {
                    this.errorMessage(`无法找到${begin}-${end}的边`);
                }
            }
        },
        traversal(options) {
            const { method, name } = options;
            let res = [];
            if(method === 'bfs') {
                res = this.alGraph.createGraphByBFS(name);
            }else if(method === 'dfs') {
                res = this.alGraph.createGraphByDFS(name);
            }
            if(res.length === 0) {
                this.errorMessage('输入有误，无法找到起始点');
            }else if(method === 'dfs') {
                this.graph.displayDFSTraversal(res, () => {
                    const message = res.map((item) => {
                        return item.name;
                    }).reduce((prev, cur) => {
                        return prev + ' --> ' + cur;
                    });
                    this.$alert(message, '深度遍历 DFS 算法结果', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.resetStyle();
                        }
                    });
                });
                this.handleMenu();

            }else if(method === 'bfs') {
                this.graph.displayBFSTraversal(res, () => {
                   const message = res.map((item) => {
                        return item.name;
                    }).reduce((prev, cur) => {
                        return prev + ' --> ' + cur;
                    });
                    this.$alert(message, '广度遍历 BFS 算法结果', {
                        confirmButtonText: '确定',
                        callback: () => {
                            this.resetStyle();
                        }
                    });         
                });
                this.handleMenu();
            }
        },
        dijkstra(options) {
            const { name } = options;
            const res = this.alGraph.shortestPath(name);
            if(res.length === 0) {
                this.errorMessage('输入有误，无法找到起始点');
            }else {
                this.graph.outputDijkstra(res, () => {
                    const distObj = {};
                    res.forEach(function(item){
                        if(!distObj[item.node]){
                            distObj[item.node] = item.dist;
                        }else{
                            distObj[item.node] = item.dist < distObj[item.node] ? item.dist : distObj[item.node];
                        }
                    });
                    let message = "<table>";
                    message += "<thead><tr><th>#</th>";
                    for(const key in distObj){
                        message += "<th>" + key + "</th>";
                    }
                    message += "</tr></thead><tbody><tr><th>" + res[0].node + "</th>";
                    for(const key in distObj){
                        message += "<th>" + distObj[key] + "</th>";
                    }
                    message += "</tr></tbody></table>";
                    this.$alert(message, 'Dijkstra 算法结果:', {
                        dangerouslyUseHTMLString: true,
                        customClass: "result-dialog",
                        confirmButtonText: '确定',
                        callback: () => {
                            this.resetStyle();
                        }
                    });
                });
                this.handleMenu();
            }
        },
        kruskal() {
            const res = this.alGraph.outputKruskal();
            this.graph.outputKruskal(res, () => {
                let message = "<table class='table table-striped'>";
                message += "<tbody>"
                for(let i = 0, len = res.length; i < len; i++){
                    message += "<tr><th>" + (i + 1) + "、" + res[i].begin + " - " + res[i].end + ' 需要修一条路.' + "</th></tr>";
                }
                message += "</tbody></table>";
                this.$alert(message, 'Kruskal 算法结果:', {
                    dangerouslyUseHTMLString: true,
                    customClass: "result-dialog",
                    confirmButtonText: '确定',
                    callback: () => {
                        this.resetStyle();
                    }
                });
            });
            this.handleMenu();
        },
        prim() {
            const res = this.alGraph.outputPrim();
            this.graph.outputPrim(res, () => {
                let message = "<table class='table table-striped'>";
                message += "<tbody>"
                for(let i = 0, len = res.length; i < len; i++){
                    message += "<tr><th>" + (i + 1) + "、" + res[i].begin + " - " + res[i].end + ' 需要修一条路.' + "</th></tr>";
                }
                message += "</tbody></table>";
                this.$alert(message, 'Prim 算法结果:', {
                    dangerouslyUseHTMLString: true,
                    customClass: "result-dialog",
                    confirmButtonText: '确定',
                    callback: () => {
                        this.resetStyle();
                    }
                });
            });
            this.handleMenu();
        },
        saveData() {
            
        }
    },  
}
</script>

<style lang="scss">
    #animation {
        width: 100%;
        height: 100%;
    }
    .result-dialog {
        width: 500px;
    }
</style>
