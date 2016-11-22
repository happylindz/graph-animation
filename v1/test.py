G = {
    1: {2, 3, 6},
    2: {1, 3},
    3: {1, 2, 4, 7},
    4: {3, 5, 6},
    5: {4, 6},
    6: {4, 5, 7}, 
    7: {1, 3, 6}
};

def find_cir(G, x, target, poten, path=()):
    if path is None:
        path = (x,)
    if poten < 1:
        pass
    elif poten == 1:
        if target in G[x]:
            yield path
    else:
        
