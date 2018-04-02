<template>
    <div id="toolbar">
        <el-button class="menu-btn" icon="el-icon-menu" @click="handleMenu">菜单</el-button>
        <el-collapse class="toolbar-menu" :class="{ 'toolbar-menu-show': isShow }" v-model="activeName" accordion>
            <el-collapse-item title="重置操作 Reset Operation" name="1">
                <el-row>
                    <el-button @click="resetNodes" class="full-btn" size="small">还原节点(默认节点)</el-button>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="节点操作 Node Operation" name="2">
                <el-row>
                    <el-input v-model="node.name" placeholder="请输入节点名称"></el-input>
                    <el-input v-model="node.popularity" placeholder="请输入节点权重(整数)"></el-input>
                    <el-input v-model="node.desc" placeholder="清输入节点的描述"></el-input>
                </el-row>
                <el-row>
                    <el-button @click="addNode" class="full-btn" size="small">添加节点(需要全填)</el-button>
                </el-row>
                <el-row>
                    <el-button @click="deleteNode" class="full-btn" size="small">删除节点(只需名称)</el-button>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="邻边操作 Edge Operation" name="3">
                <el-row>
                    <el-input v-model="edge.begin" placeholder="请输入起始点名称"></el-input>
                    <el-input v-model="edge.end" placeholder="请输入终止点名称"></el-input>
                    <el-input v-model="edge.dist" placeholder="清输入邻边距离(整数)"></el-input>
                </el-row>
                <el-row>
                    <el-button @click="addEdge" class="full-btn" size="small">添加邻边(需要全填)</el-button>
                </el-row>
                <el-row>
                    <el-button @click="deleteEdge" class="full-btn" size="small">删除邻边(无需距离)</el-button>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="遍历节点 Traversal" name="5">
                <el-row>
                    <el-input v-model="traversal.name" placeholder="请输入起始点名称"></el-input>
                </el-row>
                <el-row>
                    <el-button @click="dfsTraversal" class="full-btn" size="small">深度遍历 DFS</el-button>
                </el-row>
                <el-row>
                    <el-button @click="bfsTraversal" class="full-btn" size="small">广度遍历 BFS</el-button>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="最短路径 Shortest Path" name="6">
                <el-row>
                    <el-input v-model="shortestPath.name" placeholder="请输入起始点名称"></el-input>
                </el-row>
                <el-row>
                    <el-button @click="dijkstra" class="full-btn" size="small">Dijkstra 算法演示</el-button>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="最小生成树 Minimum Spanning Tree" name="7">
                <el-row>
                    <el-button @click="kruskal" class="full-btn" size="small">Kruskal 算法演示</el-button>
                </el-row>
                <el-row>
                    <el-button @click="primByParent" class="full-btn" size="small">Prim 算法演示</el-button>
                </el-row>            
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    name: 'toolbar',
    props: ['isShow', 'handleMenu', 'addNodeByParent', 'deleteNodeByParent', 'addEdgeByParent', 'deleteEdgeByParent', 'traversalByParent', 'dijkstraByParent', 'kruskalByParent', 'primByParent', 'resetNodes'],
    data() {
        return {
            activeName: '0',
            node: {
                name: '',
                popularity: '',
                desc: '',
            },
            edge: {
                begin: '',
                end: '',
                dist: '',
            },
            traversal: {
                name: '',
            },
            shortestPath: {
                name: '',
            },
            keyword: '',
        }
    },
    methods: {
        errorMessage(message) {
            this.$message.error(message);
        },
        empty() {
            this.activeName = 0;
            this.node = {
                name: '',
                popularity: '',
                desc: '',
            };
            this.edge = {
                begin: '',
                end: '',
                dist: '',
            };
            this.traversal.name = '';
            this.shortestPath.name = '';
            this.keyword = '';
        },
        addNode() {
            const options = {
                name: this.node.name,
                popularity: parseInt(this.node.popularity),
                desc: this.node.desc,
            };
            if(options.name === '') {
                this.errorMessage('节点名称不能为空');
            }else if(this.node.popularity === '' || isNaN(options.popularity)) {
                this.errorMessage('节点权重不能为空，需为数字');
            }else if(options.desc === '') {
                this.errorMessage('节点描述不能为空');
            }else {
                this.addNodeByParent(options)
            }
        },
        deleteNode() {
            const options = {
                name: this.node.name,
            };
            if(options.name === '') {
                this.errorMessage('节点名称不能为空');
            }else {
                this.deleteNodeByParent(options)
            }
        },
        addEdge() {
            const options = {
                begin: this.edge.begin,
                end: this.edge.end,
                dist: parseInt(this.edge.dist)
            }
            if(options.begin === '') {
                this.errorMessage('未输入起始点');
            }else if(options.end === '') {
                this.errorMessage('未输入终止点');
            }else if(this.edge.dist === '' || isNaN(options.dist)) {
                this.errorMessage('邻边距离不能为空，需为数字');
            }else {
                this.addEdgeByParent(options);
            }
        },
        deleteEdge() {
            const options = {
                begin: this.edge.begin,
                end: this.edge.end,
            }
            if(options.begin === '') {
                this.errorMessage('未输入起始点');
            }else if(options.end === '') {
                this.errorMessage('未输入终止点');
            }else {
                this.deleteEdgeByParent(options);
            }
        },
        dfsTraversal() {
            const options = {
                name: this.traversal.name,
                method: 'dfs',
            }
            if(options.name === '') {
                this.errorMessage('未输入起始点');
            }else {
                this.traversalByParent(options);
            }
        },
        bfsTraversal() {
            const options = {
                name: this.traversal.name,
                method: 'bfs',
            }
            if(options.name === '') {
                this.errorMessage('未输入起始点');
            }else {
                this.traversalByParent(options);
            }
        },
        dijkstra() {
            const options = {
                name: this.shortestPath.name,
            };
            if(options.name === '') {
                this.errorMessage('未输入起始点');
            }else {
                this.dijkstraByParent(options);
            }
        },
        kruskal() {
            this.kruskalByParent();
        },
        prim() {
            this.primByParent();
        }
    }
}
</script>

<style lang="scss">
    #toolbar {
        position: absolute;
        left: 0;
        top: 0;
        width: 280px;
        user-select: none;
        .menu-btn {
            display: block;
            width: 100%;
            font-size: 16px;
        }
        .toolbar-menu {
            height: 0;
            display: none;
            &.toolbar-menu-show {
                display: block;
            }
        }
        [role="tab"] {
            text-indent: 10px;
        }
        .el-collapse-item__arrow.is-active {
            position: relative;
            top: -4px;
        }
        .el-collapse-item__content {
            padding-bottom: 0;
        }
        .full-btn {
            display: block;
            width: 100%;
        }
    }
</style>
