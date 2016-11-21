# Graph G
G = {
1 : {2, 3, 7},
2 : {1, 3},
3 : {1, 2, 4, 7},
4 : {3, 5, 6},
5 : {4, 6},
6 : {4, 5, 7},
7 : {1, 3, 6},
}

# G: graph G
# length: length of circles
# path: circles starts with nodes in path
def find_cir_starts_with(G, length, path):
    l, last = len(path), path[-1]
    cnt = 0
    if l==length-1:  # choose the final node in the circle
        for i in G[last]:
            if (i > path[1]) and (i not in path) and (path[0] in G[i]):
                print path + [i]
                cnt += 1
    else:
        for i in G[last]:  # choose internal nodes in the circle
            if (i > path[0]) and (i not in path):
                cnt += find_cir_starts_with(G, length, path + [i])
    return cnt

# G: graph G
# n: number of nodes
# length: length of circles
def find_cir_of_length(G, n, length):
    cnt = 0
    for i in xrange(1, n-length+2):  # find all circles starts with i
        cnt += find_cir_starts_with(G, length, [i])
    return cnt

# G: graph G
# n: number of nodes
def find_all_cirs(G, n):
    cnt = 0
    for i in xrange(3, n+1):  # find all circles of length i
        cnt += find_cir_of_length(G, n, i)
    return cnt

find_all_cirs(G, 7)
