import $ from 'jquery';
import d3 from 'd3';

const requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

export default class {
    constructor(nodes, edges) {
        this.container = '#animation';
        this.width = $(this.container).width();
        this.height = $(this.container).height();
        this.init(nodes, edges);
    }
    init(nodes, edges) {
        edges.forEach((edge) => {
            for (let i = 0, len = nodes.length; i < len; i++) {
                if (nodes[i].name === edge.source) {
                    edge.source = nodes[i];
                }
                if(nodes[i].name === edge.target) {
                    edge.target = nodes[i];
                }
            }
        });
        this.nodes_data = nodes;
        this.edges_data = edges;
        const force = d3.layout.force()
                                .nodes(this.nodes_data)
                                .links(this.edges_data)
                                .size([this.width, this.height])
                                .linkDistance((data) => {
                                    return data.dist * 25;
                                })
                                .friction(0.8)
								.charge(-3000);
        force.start();
        this.force = force;
    }
    drawing() {
        const svg = d3.select(this.container)
                        .append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height);
        this.svg_edges       = svg.append('g').attr('id', 'svg_edges')
                                               .selectAll('path').data(this.force.links());
        this.svg_nodes       = svg.append('g').attr('id', 'svg_nodes')
                                               .selectAll('circle').data(this.force.nodes());
        this.svg_nodes_texts = svg.append('g').attr('id', 'svg_nodes_texts')
                                               .selectAll('text').data(this.force.nodes());
        this.svg_edges_texts = svg.append('g').attr('id', 'svg_edges_texts')
                                                .selectAll('text')
                                                .data(this.force.links());
        this.updateEdge();
        this.updateNode();
        this.svg = svg;
        this.tick();
    }
    updateNode() {
        this.svg_nodes.enter().append('circle');
        this.svg_nodes.exit().remove();
        this.svg_nodes.attr({
            'r' : (node) => {
                return node.popularity * 4;
            },
        }).style({
            'fill': '#f6e8e9',
            'stroke': '#a254a2', 
        }).on('click', (node) => {
            if(d3.event.defaultPrevented) {
                return;
            }
            if(node.desc !== '') {
                // console.log('Node description', node.desc);
            }
        }).call(this.force.drag);
        this.svg_nodes_texts.enter().append('text');
        this.svg_nodes_texts.exit().remove();
        
        this.svg_nodes_texts.attr({
            'dy': '.35em',
            'text-anchor': 'middle',
            'x': function() {
                let tspan = d3.select(this).select('tspan');
                if(tspan.size() === 0) {
                    d3.select(this).append('tspan')
                        .attr({
                            'x': 0,
                            'y': 0,
                        })
                        .text((d) => {
                            return d.name;
                        });
                }else {
                    tspan.attr({
                        'x': 0,
                        'y': 0,
                    }).text((d) => {
                        return d.name;
                    });
                }
            }
        }).style({
            'fill': '#a254a2',
        });
        this.force.start();
    }
    updateEdge() {
        this.svg_edges.enter().append('path');
        this.svg_edges.exit().remove();
        this.svg_edges.style({
            'stroke': '#b43232',
            'stroke-width': 0.5,
        }).attr({
            'id': (d, i) => {
                return `edgepath${i}`;
            }
        }).attr('d', (d) => {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });
        
        let svg_edges_texts = this.svg_edges_texts.enter().append('text');
        this.svg_edges_texts.exit().remove();
        svg_edges_texts.append('textPath');
        this.svg_edges_texts.style({
            'fill': 'black',
            'pointer-events': 'none',
        }).attr({
            'dx': (edge) => {
                const radius = [];
                this.nodes_data.forEach((node) => {
                    if (node.name == edge.source.name || node.name == edge.target.name) {
                        radius.push(node.popularity * 4);
                    }
                });
                let dist = edge.dist * 25;
                radius.forEach(function (r) {
                    dist -= r / 2;
                })
                return dist / 2 + 30;
            }
        });
        this.svg_edges_texts.select('textPath')
                            .attr('xlink:href', (d, i) => {
                                return `#edgepath${i}`;
                            })
                            .style('pointer-events', 'none')
                            .text((d) => {
                                return d.dist;
                            });
        this.force.start();
    }
    tick() {
        this.force.on('tick', () => {
            this.svg_edges.attr('d', (d) => {
                return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
            });
            this.svg_nodes.attr('transform', this.transform);
            this.svg_nodes_texts.attr('transform', this.transform);
            if(this.svg_path_texts) {
                this.svg_path_texts.attr('transform', this.transform);
            }
        })
    }
    transform(d) {
        return "translate(" + (d.x) + "," + (d.y) + ")";
    }
    resetStyle() {
        this.nodes_data.forEach((data) => {
            data.isVisited = false;
            data.path = Infinity;
        });
        this.edges_data.forEach((data) => {
            data.isVisited = false;
        });
        this.svg_edges.style("stroke-width", () => {
            return 0.5;
        });
        this.svg_nodes.style("fill", "#F6E8E9");
        if (this.svg_path_texts) {
            this.svg.select("#svg_path_texts").remove();
            this.svg_path_texts = null;
        }
    }
    insertNode(name, desc, popularity) {
        this.nodes_data.push({
            name: name,
            desc: desc,
            popularity: popularity,
        });
        this.svg_nodes = this.svg_nodes.data(this.force.nodes());
        this.svg_nodes_texts = this.svg_nodes_texts.data(this.force.nodes());
        this.updateNode();
    }
    deleteNode(name) {
        let index = -1;
        for(let i = 0, len = this.nodes_data.length; i < len; i++) {
            if(this.nodes_data[i].name === name) {
                index = i;
                break;
            }
        }
        let removed = [];
        this.nodes_data.splice(index, 1);
        for(let i = 0, len = this.edges_data.length; i <len; i++) {
            if(this.edges_data[i].source.name === name || this.edges_data[i].target.name === name) {
                removed.unshift(i);
            }
        }
        for (let i = 0, len = removed.length; i < len; i++) {
            this.edges_data.splice(removed[i], 1);
        }
        this.svg_nodes = this.svg_nodes.data(this.force.nodes())
        this.svg_nodes_texts = this.svg_nodes_texts.data(this.force.nodes())
        this.updateNode();

        this.svg_edges = this.svg_edges.data(this.force.links());
        this.svg_edges_texts = this.svg_edges_texts.data(this.force.links());
        this.updateEdge();
    }
    insertEdge(begin, end, dist) {
        let beginNode, endNode;
        this.nodes_data.forEach(function (node) {
            if (node.name == begin) {
                beginNode = node;
            }
            if (node.name == end) {
                endNode = node;
            }
        });

        this.edges_data.push({"source": beginNode, "target": endNode, "dist": parseInt(dist)});

        this.svg_edges = this.svg_edges.data(this.force.links());
        this.svg_edges_texts = this.svg_edges_texts.data(this.force.links());
        this.updateEdge();
    }
    deleteEdge(begin, end) {
        let index = -1;
        for (let i = 0, len = this.edges_data.length; i < len; i++) {
            if ((this.edges_data[i].source.name == begin && this.edges_data[i].target.name == end) || (this.edges_data[i].source.name == end && this.edges_data[i].target.name == begin)) {
                index = i;
                break;
            }
        }
        this.edges_data.splice(index, 1);
        this.svg_edges = this.svg_edges.data(this.force.links());
        this.svg_edges_texts = this.svg_edges_texts.data(this.force.links());
        this.updateEdge();
    }
    traversalAnimation(count, index, data, callback) {
        if (index <= data.length) {
            if (count % 60 === 0 && count >= 0) {
                callback(index);
                requestAnimationFrame(() => this.traversalAnimation(count + 1, index + 1, data, callback));
            } else {
                requestAnimationFrame(() => this.traversalAnimation(count + 1, index, data, callback));
            }
        }
    }
    traversalAnimation2(count, index, data, callback) {
        if (index <= data.length) {
            if (count % 90 === 0 && count >= 0) {
                callback(index);
                requestAnimationFrame(() => this.traversalAnimation2(count + 1, index + 1, data, callback));
            } else {
                requestAnimationFrame(() => this.traversalAnimation2(count + 1, index, data, callback));
            }
        }
    }
    displayDFSTraversal(data, callback) {
        this.traversalAnimation(0, 0, data, (i) => {
            if(i === data.length) {
                callback();
            }else if(i < data.length) {
                this.svg_nodes.transition().duration(500).ease("linear").style("fill", function (node) {
                    if (node.name == data[i].name) {
                        node.isVisited = true;
                        return "#A254A2";
                    } else if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                });
            }
        });
        this.traversalAnimation(-30, 0, data, (i) => {
            if(i + 1 < data.length) {
                this.svg_edges.transition().duration(500).ease("linear").style("stroke-width", function (line) {
                    if ((line.source.name == data[i].name && line.target.name == data[i + 1].name) || (line.source.name == data[i + 1].name && line.target.name == data[i].name)) {
                        return 3;
                    } else {
                        return 0.5;
                    }
                })
            }
        });
    }
    displayBFSTraversal(data, callback) {
        let dataIndex = 0;
        this.traversalAnimation(0, 0, data, (i) => {
            if (i === data.length) {
                callback();
            } else if (i < data.length) {
                const name = data[i].name;
                this.svg_nodes.transition().duration(500).ease("linear").style("fill", function (node) {
                    if (node.name == name) {
                        node.isVisited = true;
                        return "#A254A2";
                    } else if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                });
                if (data[i].selected == true) {
                    dataIndex = i;
                }
            }
        });
        this.traversalAnimation(-30, 0, data, (i) => {
            if (i + 1 < data.length) {
                this.svg_edges.transition().duration(500).ease("linear").style("stroke-width", function (line) {
                    if (i + 1 >= data.length || data[i + 1].selected == true) {
                        return 0.5;
                    }
                    if ((line.source.name == data[dataIndex].name && line.target.name == data[i + 1].name) || (line.source.name == data[i + 1].name && line.target.name == data[dataIndex].name)) {
                        return 3;
                    } else {
                        return 0.5;
                    }
                });
            }
        });
    }
    outputDijkstra(data, callback) {
        let dataIndex = 0, item = null;
        // 初始化
        this.svg_path_texts = this.svg.append("g").attr("id", "svg_path_texts").selectAll("text").data(this.force.nodes()).enter().append("text").attr({
            "dy": ".35em",
            "text-anchor": "middle",
            "x": function (node) {
                return node.popularity * 4 + 5;
            },
            "y": function (node) {
                
                return node.popularity * 4 + 5;
            }
        }).text(function (node) {
            if (node.name == data[0].node) {
                node.path = 0;
            }
            return node.path;
        })
        .attr("transform", this.transform);

        this.traversalAnimation2(0, 0, data, (i) => {
            if (i === data.length) {
                callback && callback();
                dataIndex = 0;
            } else if (i < data.length) {
                item = data[i];
                const name = data[i].node;
                const selected = data[i].selected;
                this.svg_nodes.transition().duration(500).ease("linear").style("fill", function (node) {
                    if (selected == true && node.name == name) {
                        node.isVisited = true;
                        return "#233142";
                    }
                    if (node.name == name) {
                        return "#A254A2";
                    } else if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                })
                if (data[i].selected == true) {
                    dataIndex = i;
                }
            }
        });

        this.traversalAnimation2(-30, 0, data, (i) => {
            if (i + 1 < data.length) {
                this.svg_edges.transition().duration(500).ease("linear").style("stroke-width", function (line) {
                    if (i + 1 >= data.length || data[i + 1].selected == true) {
                        return 0.5;
                    }
                    if ((line.source.name == data[dataIndex].node && line.target.name == data[i + 1].node) || (line.source.name == data[i + 1].node && line.target.name == data[dataIndex].node)) {
                        return 3;
                    } else {
                        return 0.5;
                    }
                });
            }
        });

        this.traversalAnimation2(-60, 0, data, (i) => {
            if (i + 1 < data.length) {
                const name = item.node;
                const dist = item.dist;
                this.svg_path_texts.transition().duration(500).ease("linear").text(function (node) {
                    if (node.name == name) {
                        node.path = dist;
                    }
                    return node.path;
                });
            }
        });
    }
    outputKruskal(edges, callback) {
        this.traversalAnimation(0, 0, edges, (i) => {
            if (i === edges.length) {
                this.svg_nodes.transition().duration(1000).ease("linear").style("fill", function (node) {
                    if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                });
                callback && callback();
            } else if (i < edges.length) {
                const edge = edges[i];
                this.svg_edges.transition().duration(1000).ease("linear").style("stroke-width", function (line) {
                    if ((line.source.name == edge.begin && line.target.name == edge.end) || (line.source.name == edge.end && line.target.name == edge.begin)) {
                        line.isVisited = true;
                        return 3;
                    } else if (line.isVisited) {
                        return 3;
                    } else {
                        return 0.5;
                    }
                });
                this.svg_nodes.transition().duration(1000).ease("linear").style("fill", function (node) {
                    if (edge.begin == node.name || edge.end == node.name) {
                        node.isVisited = true;
                        return "#A254A2";
                    } else if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                })
            }
        });
    }
    outputPrim(edges, callback) {
        this.traversalAnimation2(0, 0, edges, (i) => {
            if (i === edges.length) {
                this.svg_nodes.transition().duration(500).ease("linear").style("fill", function (node) {
                    if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                });
                callback && callback();
            } else if (i < edges.length) {
                const edge = edges[i];
                this.svg_nodes.transition().duration(500).ease("linear").style("fill", function (node) {
                    if (edge.begin == node.name) {
                        node.isVisited = true;
                        return "#A254A2";
                    } else if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                });
            }
        });

        this.traversalAnimation2(-30, 0, edges, (i) => {
            if (i < edges.length) {
                const edge = edges[i];
                this.svg_edges.transition().duration(500).ease("linear").style("stroke-width", function (line) {

                    if ((line.source.name == edge.begin && line.target.name == edge.end) || (line.source.name == edge.end && line.target.name == edge.begin)) {
                        line.isVisited = true;
                        return 3;
                    } else if (line.isVisited) {
                        return 3;
                    } else {
                        return 0.5;
                    }
                });
            }
        });

        this.traversalAnimation2(-60, 0, edges, (i) => {
            if (i < edges.length) {
                const edge = edges[i];
                this.svg_nodes.transition().duration(500).ease("linear").style("fill", function (node) {
                    if (edge.end == node.name) {
                        node.isVisited = true;
                        return "#A254A2";
                    } else if (node.isVisited == true) {
                        return "#A95";
                    } else {
                        return "#F6E8E9";
                    }
                });
            }
        });
    }
}