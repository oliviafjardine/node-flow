import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isVisited: boolean;
  isActive: boolean;
  visitOrder?: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  isHighlighted: boolean;
}

const GraphTraversalsVisualizer: React.FC = () => {
  const initialNodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 200, y: 100, isVisited: false, isActive: false },
    { id: 'B', label: 'B', x: 100, y: 200, isVisited: false, isActive: false },
    { id: 'C', label: 'C', x: 300, y: 200, isVisited: false, isActive: false },
    { id: 'D', label: 'D', x: 50, y: 300, isVisited: false, isActive: false },
    { id: 'E', label: 'E', x: 150, y: 300, isVisited: false, isActive: false },
    { id: 'F', label: 'F', x: 250, y: 300, isVisited: false, isActive: false },
    { id: 'G', label: 'G', x: 350, y: 300, isVisited: false, isActive: false },
  ];

  const initialEdges: GraphEdge[] = [
    { id: 'AB', from: 'A', to: 'B', isHighlighted: false },
    { id: 'AC', from: 'A', to: 'C', isHighlighted: false },
    { id: 'BD', from: 'B', to: 'D', isHighlighted: false },
    { id: 'BE', from: 'B', to: 'E', isHighlighted: false },
    { id: 'CF', from: 'C', to: 'F', isHighlighted: false },
    { id: 'CG', from: 'C', to: 'G', isHighlighted: false },
    { id: 'DE', from: 'D', to: 'E', isHighlighted: false },
    { id: 'FG', from: 'F', to: 'G', isHighlighted: false },
  ];

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [algorithm, setAlgorithm] = useState<'BFS' | 'DFS'>('BFS');
  const [startNode, setStartNode] = useState('A');
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [stack, setStack] = useState<string[]>([]);

  const getAdjacencyList = (): Map<string, string[]> => {
    const adjList = new Map<string, string[]>();
    
    nodes.forEach(node => {
      adjList.set(node.id, []);
    });

    edges.forEach(edge => {
      adjList.get(edge.from)?.push(edge.to);
      adjList.get(edge.to)?.push(edge.from); // Undirected graph
    });

    return adjList;
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const performBFS = async () => {
    const adjList = getAdjacencyList();
    const visited = new Set<string>();
    const queue = [startNode];
    const order: string[] = [];
    let step = 0;

    setQueue([startNode]);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      order.push(current);
      
      // Update UI
      setNodes(prev => prev.map(node => ({
        ...node,
        isVisited: visited.has(node.id),
        isActive: node.id === current,
        visitOrder: visited.has(node.id) ? order.indexOf(node.id) + 1 : undefined
      })));
      
      setTraversalOrder([...order]);
      setCurrentStep(++step);
      
      await sleep(1000);
      
      // Add neighbors to queue
      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      }
      
      setQueue([...queue]);
      
      // Highlight edges to neighbors
      setEdges(prev => prev.map(edge => ({
        ...edge,
        isHighlighted: (edge.from === current || edge.to === current) && 
                      (visited.has(edge.from) || visited.has(edge.to))
      })));
      
      await sleep(500);
    }
    
    setQueue([]);
  };

  const performDFS = async () => {
    const adjList = getAdjacencyList();
    const visited = new Set<string>();
    const stack = [startNode];
    const order: string[] = [];
    let step = 0;

    setStack([startNode]);
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      order.push(current);
      
      // Update UI
      setNodes(prev => prev.map(node => ({
        ...node,
        isVisited: visited.has(node.id),
        isActive: node.id === current,
        visitOrder: visited.has(node.id) ? order.indexOf(node.id) + 1 : undefined
      })));
      
      setTraversalOrder([...order]);
      setCurrentStep(++step);
      
      await sleep(1000);
      
      // Add neighbors to stack (in reverse order for consistent left-to-right traversal)
      const neighbors = (adjList.get(current) || []).reverse();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
      
      setStack([...stack]);
      
      // Highlight edges to neighbors
      setEdges(prev => prev.map(edge => ({
        ...edge,
        isHighlighted: (edge.from === current || edge.to === current) && 
                      (visited.has(edge.from) || visited.has(edge.to))
      })));
      
      await sleep(500);
    }
    
    setStack([]);
  };

  const startTraversal = async () => {
    setIsTraversing(true);
    resetVisualization();
    
    if (algorithm === 'BFS') {
      await performBFS();
    } else {
      await performDFS();
    }
    
    setIsTraversing(false);
  };

  const resetVisualization = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTraversalOrder([]);
    setCurrentStep(0);
    setQueue([]);
    setStack([]);
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'BFS' | 'DFS')}
            disabled={isTraversing}
            className="w-full px-3 py-2 border border-subtle rounded text-primary bg-surface"
          >
            <option value="BFS">Breadth-First Search (BFS)</option>
            <option value="DFS">Depth-First Search (DFS)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Start Node</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isTraversing}
            className="w-full px-3 py-2 border border-subtle rounded text-primary bg-surface"
          >
            {initialNodes.map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Controls</label>
          <div className="flex gap-2">
            <button
              onClick={startTraversal}
              disabled={isTraversing}
              className="flex-1 px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Start {algorithm}
            </button>
            <button
              onClick={resetVisualization}
              disabled={isTraversing}
              className="flex-1 px-4 py-2 bg-error text-inverse rounded disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data Structure Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {algorithm === 'BFS' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Queue (FIFO)</label>
            <div className="p-3 bg-surface-elevated border border-subtle rounded min-h-[40px] flex items-center gap-2">
              {queue.length === 0 ? (
                <span className="text-muted text-sm">Empty</span>
              ) : (
                queue.map((node, index) => (
                  <div key={index} className="px-2 py-1 bg-accent-light text-accent rounded text-sm">
                    {node}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {algorithm === 'DFS' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Stack (LIFO)</label>
            <div className="p-3 bg-surface-elevated border border-subtle rounded min-h-[40px] flex items-center gap-2">
              {stack.length === 0 ? (
                <span className="text-muted text-sm">Empty</span>
              ) : (
                stack.map((node, index) => (
                  <div key={index} className="px-2 py-1 bg-warning-light text-warning rounded text-sm">
                    {node}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Traversal Order</label>
          <div className="p-3 bg-surface-elevated border border-subtle rounded min-h-[40px] flex items-center gap-2">
            {traversalOrder.length === 0 ? (
              <span className="text-muted text-sm">Not started</span>
            ) : (
              traversalOrder.map((node, index) => (
                <div key={index} className="px-2 py-1 bg-success-light text-success rounded text-sm">
                  {index + 1}. {node}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Graph Traversal Algorithms"
      description="BFS explores nodes level by level using a queue, while DFS explores as far as possible along each branch using a stack. Both visit all reachable nodes in O(V + E) time."
      backLink="/algorithms"
      onReset={resetVisualization}
      controls={controls}
      complexity={{
        time: "O(V + E) where V = vertices, E = edges",
        space: "O(V) for the queue/stack and visited set"
      }}
      operations={[
        "Choose between BFS (breadth-first) and DFS (depth-first)",
        "Select starting node for traversal",
        "Watch the queue/stack data structure in action",
        "Observe the different traversal patterns"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="relative bg-surface border border-subtle rounded" style={{ height: '400px' }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render edges */}
            {edges.map((edge) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={edge.id}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={edge.isHighlighted ? "hsl(var(--color-accent))" : "hsl(var(--color-border))"}
                  strokeWidth={edge.isHighlighted ? "3" : "2"}
                />
              );
            })}
          </svg>

          {/* Render nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-12 h-12 border-2 rounded-full flex items-center justify-center font-bold ${
                node.isActive
                  ? 'bg-warning-light border-warning text-warning'
                  : node.isVisited
                  ? 'bg-success-light border-success text-success'
                  : 'bg-surface-elevated border-subtle text-primary'
              }`}
              style={{
                left: node.x - 24,
                top: node.y - 24,
              }}
            >
              {node.label}
              {node.visitOrder && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-inverse rounded-full text-xs flex items-center justify-center">
                  {node.visitOrder}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default GraphTraversalsVisualizer;
