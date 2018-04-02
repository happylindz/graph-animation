<template>
	<div id="app">
		<Animation 
			ref="animation" 
			:handleMenu="handleMenu"
		/>
		<Toolbar
			ref="toolbar"
			:isShow="isShow"
			:handleMenu="handleMenu"
			:addNodeByParent="addNode"
			:deleteNodeByParent="deleteNode"
			:addEdgeByParent="addEdge"
			:deleteEdgeByParent="deleteEdge"
			:traversalByParent="traversal"
			:dijkstraByParent="dijkstra"
			:kruskalByParent="kruskal"
			:primByParent="prim"
			:resetNodes="resetNodes"
		/>
	</div>
</template>

<script>
import Animation from './components/animation/index.vue';
import Toolbar from './components/toolbar/index.vue';
export default {
	name: 'app',
	data() {
		return {
			isShow: false,
		} 
	},
	components: {
		Animation,
		Toolbar,
	},
	methods: {
		handleMenu() {
			this.isShow = !this.isShow;
			this.$refs.toolbar.empty()
		},
		addNode(options) {
			this.$refs.animation.addNode(options);
		},
		deleteNode(options) {
			this.$refs.animation.deleteNode(options);
		},
		addEdge(options) {
			this.$refs.animation.addEdge(options);
		},
		deleteEdge(options) {
			this.$refs.animation.deleteEdge(options);
		},
		traversal(options) {
			this.$refs.animation.traversal(options);
		},
		dijkstra(options) {
			this.$refs.animation.dijkstra(options);
		},
		kruskal() {
			this.$refs.animation.kruskal();
		},
		prim() {
			this.$refs.animation.prim();
		},
		resetNodes() {
			this.$refs.animation.resetNodes();
		}
	},
}
</script>

<style>
html, body {
	margin: 0;
	padding: 0;
	height: 100%;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 0;
	padding: 0;
	height: 100%;
	overflow: hidden;
	position: relative;
}
</style>
