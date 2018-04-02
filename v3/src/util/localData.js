import nodes from '../data/nodes.json';
import edges from '../data/edges.json';

export const readData = () => {
  if (window.localStorage) {
    const localStorage = window.localStorage;
    if ((localStorage.getItem('nodes') !== 'undefined' && localStorage.getItem('nodes') !== null) && (localStorage.getItem('edges') !== 'undefined' && localStorage.getItem('edges') !== null)) {
      return {
        current: {
          nodes : JSON.parse(localStorage.getItem('nodes')),
          edges : JSON.parse(localStorage.getItem('edges')),
        },
        default: {
          nodes: nodes,
          edges: edges,
        },
      }
    }
  }
  return {
    default: {
      nodes: nodes,
      edges: edges
    },
  }
};


export const saveData = (nodes, edges) => {
  if(window.localStorage) {
    const localStorage = window.localStorage;
    localStorage.setItem('nodes', JSON.stringify(nodes));
    localStorage.setItem('edges', JSON.stringify(edges));
  }
}
