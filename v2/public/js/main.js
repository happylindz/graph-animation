$(document.body).on("click", ".traversal", function(){
	let beginNode = $('#begin').val();
	let data = JSON.stringify({
					name: beginNode,
					method: $(this).attr("data-method")
				});
	new Promise(function(resolve, reject){
			$.ajax({
				url: '/traversal',
				type: "post",
				dataType: "json",
				contentType: "application/json",
				data: data
			})
			.done(function(res) {
				if(res.code == 0){
					resolve(res.data);
				}else{
					reject(res);
				}
			})
			.fail(function(error) {
				console.log(error);
				reject(error);
			});	
	}).then(function(res){
			for(let i = 0; i < res.length; i++){
				setTimeout(function(){
					graph.svg_nodes.transition().duration(500).ease("linear").style("fill",function(node){
						if(node.name == res[i]){
							node.isVisited = true;
							return "#A254A2";
						}else if(node.isVisited == true){
							return "#A95";
						}else{
							return "#F6E8E9";
						}
					})
				}, i * 1000);
				setTimeout(function(){
					graph.svg_edges.transition().duration(500).ease("linear").style("stroke-width", function(line){
						if((line.source.name == res[i] && line.target.name==res[i + 1]) || (line.source.name == res[i + 1] && line.target.name==res[i])){
							return 3;
						}else{
							return 0.5;
						}
					})
				}, i * 1000 + 500);
			}
			setTimeout(function(){
				let message = res[0];
				for(let i = 1, len = res.length; i < len; i++){
					message += " --> " + res[i];
				}
				let box = bootbox.alert({
					size: "large",
					title: "导游路线图查询结果:",
					message: message,
					buttons:{
						ok:{
							label: "确认",
							className: "btn-primary"
						}
					},
					callback: function(){
						console.log("finally nodes");
						graph.nodes.forEach(function(data){
							data.isVisited = false;
						});
						graph.svg_nodes.style("fill", "#F6E8E9");
					}
				});	
				box.css({
					'top': '50%',
					'margin-top': function () {
					  return -(box.height() / 2);
					}
				});

			}, res.length * 1000);
			
	}).catch(function(error){
		let message;
		if(error.code == 1){
			message = "输入有误，未能找到起点";
		}else{
			message = "服务器发生故障";
		}
		let box = bootbox.alert({
			size: "small",
			title: "导游路线图查询结果:",
			message:  message,
			buttons:{
				ok:{
					label: "确认",
					className: "btn-primary"
				}
			}
		});	
		box.css({
			'top': '50%',
			'margin-top': function () {
			  return -(box.height() / 2);
			}
		});

	});
})


$(document.body).on("click", "#add_node_btn", function () {
	let name = $("#add_node").val();
	let popularity = $("#popularity").val();
	let desc = $("#desc").val();
	graph.insertNode(name, desc, popularity);
});

$(document.body).on("click", "#add_edge", function(){
	let begin = $('#edge_begin').val();
	let end = $('#edge_end').val();
	let dist = $("#edge_dist").val();
	graph.insertEdge(begin, end, dist);
});
