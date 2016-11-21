#define VertexNum 5
typedef struct{
	char vertex[VertexNum];
	int edges[VertexNum][VertexNum];
	int n, e;
}MGraph;

typedef struct node
{
	int u;
	int v;
	int w;
}Edge;


void kruskal(MGraph G){

	int i, j, u1, v1, sn1, sn2, k;
	int vset[VertexNum];
	int E[EgdeNum];
	k = 0;
	for(i = 0; i < G.n; i++){
		for(j = 0; j < G.n; j++){
			if(G.edges[i][j] != 0 && G.edges[i][j] != INF){
				E[k].u = i;
				E[k].v = j;
				E[k].v = G.edges[i][j];
				k++;
			}
		}
	}
	for(i = 0; i < G.n; i++){
		vset[i] = i;
	}
	k = 1;
	while(k < G.n){
		
	}



}