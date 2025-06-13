import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  distance: number;
  isVisited: boolean;
  isActive: boolean;
  previous: string | null;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  isHighlighted: boolean;
}

const DijkstraBellmanVisualizer: React.FC = () => {
  const initialNodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 100, y: 100, distance: Infinity, isVisited: false, isActive: false, previous: null },
    { id: 'B', label: 'B', x: 300, y: 100, distance: Infinity, isVisited: false, isActive: false, previous: null },
    { id: 'C', label: 'C', x: 500, y: 100, distance: Infinity, isVisited: false, isActive: false, previous: null },
    { id: 'D', label: 'D', x: 200, y: 250, distance: Infinity, isVisited: false, isActive: false, previous: null },
    { id: 'E', label: 'E', x: 400, y: 250, distance: Infinity, isVisited: false, isActive: false, previous: null },
  ];

  const initialEdges: GraphEdge[] = [
    { id: 'AB', from: 'A', to: 'B', weight: 4, isHighlighted: false },
    { id: 'AC', from: 'A', to: 'C', weight: 2, isHighlighted: false },
    { id: 'BD', from: 'B', to: 'D', weight: 3, isHighlighted: false },
    { id: 'BE', from: 'B', to: 'E', weight: 1, isHighlighted: false },
    { id: 'CD', from: 'C', to: 'D', weight: 4, isHighlighted: false },
    { id: 'CE', from: 'C', to: 'E', weight: 5, isHighlighted: false },
    { id: 'DE', from: 'D', to: 'E', weight: 2, isHighlighted: false },
  ];

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'bellman-ford'>('dijkstra');
  const [startNode, setStartNode] = useState('A');
  const [isRunning, setIsRunning] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getAdjacencyList = (): Map<string, { node: string; weight: number }[]> => {
    const adjList = new Map<string, { node: string; weight: number }[]>();
    
    nodes.forEach(node => {
      adjList.set(node.id, []);
    });

    edges.forEach(edge => {
      adjList.get(edge.from)?.push({ node: edge.to, weight: edge.weight });
      adjList.get(edge.to)?.push({ node: edge.from, weight: edge.weight }); // Undirected
    });

    return adjList;
  };

  const runDijkstra = async () => {
    const adjList = getAdjacencyList();
    
    // Initialize distances
    setNodes(prev => prev.map(node => ({
      ...node,
      distance: node.id === startNode ? 0 : Infinity,
      isVisited: false,
      isActive: false,
      previous: null
    })));

    setLastOperation(`Starting Dijkstra's algorithm from node ${startNode}`);
    await sleep(1000);

    const unvisited = new Set(nodes.map(n => n.id));
    let step = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current: string | null = null;
      let minDistance = Infinity;

      for (const nodeId of unvisited) {
        const node = nodes.find(n => n.id === nodeId);
        if (node && node.distance < minDistance) {
          minDistance = node.distance;
          current = nodeId;
        }
      }

      if (!current || minDistance === Infinity) break;

      // Mark current node as active
      setNodes(prev => prev.map(node => ({
        ...node,
        isActive: node.id === current
      })));

      setLastOperation(`Step ${++step}: Processing node ${current} (distance: ${minDistance})`);
      await sleep(1500);

      // Update distances to neighbors
      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        if (unvisited.has(neighbor.node)) {
          const newDistance = minDistance + neighbor.weight;
          const currentDistance = nodes.find(n => n.id === neighbor.node)?.distance || Infinity;

          if (newDistance < currentDistance) {
            setNodes(prev => prev.map(node => 
              node.id === neighbor.node 
                ? { ...node, distance: newDistance, previous: current }
                : node
            ));

            // Highlight the edge being relaxed
            setEdges(prev => prev.map(edge => ({
              ...edge,
              isHighlighted: (edge.from === current && edge.to === neighbor.node) ||
                           (edge.to === current && edge.from === neighbor.node)
            })));

            setLastOperation(`Updated distance to ${neighbor.node}: ${newDistance}`);
            await sleep(1000);
          }
        }
      }

      // Mark current node as visited
      unvisited.delete(current);
      setNodes(prev => prev.map(node => ({
        ...node,
        isVisited: node.id === current ? true : node.isVisited,
        isActive: false
      })));

      setEdges(prev => prev.map(edge => ({ ...edge, isHighlighted: false })));
      await sleep(500);
    }

    setLastOperation("Dijkstra's algorithm completed!");
  };

  const runAlgorithm = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    if (algorithm === 'dijkstra') {
      await runDijkstra();
    } else {
      setLastOperation("Bellman-Ford algorithm - Coming soon!");
    }
    
    setIsRunning(false);
  };

  const resetVisualization = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setCurrentStep(0);
    setLastOperation(null);
    setIsRunning(false);
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'dijkstra' | 'bellman-ford')}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-subtle rounded text-primary bg-surface"
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="bellman-ford">Bellman-Ford Algorithm</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Start Node</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isRunning}
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
              onClick={runAlgorithm}
              disabled={isRunning}
              className="flex-1 px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Start
            </button>
            <button
              onClick={resetVisualization}
              disabled={isRunning}
              className="flex-1 px-4 py-2 bg-error text-inverse rounded disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {lastOperation && (
        <div className="p-3 bg-accent-light border border-accent/20 rounded text-accent text-sm">
          {lastOperation}
        </div>
      )}
    </div>
  );

  return (
    <VisualizationLayout
      title="Shortest Path Algorithms"
      description="Dijkstra's algorithm finds shortest paths from a source to all vertices in weighted graphs with non-negative edges. Bellman-Ford handles negative edges but is slower."
      backLink="/algorithms"
      onReset={resetVisualization}
      controls={controls}
      complexity={{
        time: "Dijkstra: O(V² or E + V log V), Bellman-Ford: O(VE)",
        space: "O(V) for distance and previous arrays"
      }}
      operations={[
        "Initialize distances (0 for source, ∞ for others)",
        "Repeatedly select unvisited node with minimum distance",
        "Update distances to neighbors (relaxation)",
        "Mark node as visited and continue"
      ]}
    >
      <div className="w-full max-w-4xl space-y-6">
        <div className="relative bg-surface border border-subtle rounded" style={{ height: '350px' }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render edges */}
            {edges.map((edge) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={edge.isHighlighted ? "hsl(var(--color-accent))" : "hsl(var(--color-border))"}
                    strokeWidth={edge.isHighlighted ? "3" : "2"}
                  />
                  <text
                    x={midX}
                    y={midY - 5}
                    textAnchor="middle"
                    className="text-xs fill-current text-secondary"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Render nodes */}
          {nodes.map((node) => (
            <div key={node.id} className="absolute">
              <div
                className={`w-16 h-16 border-2 rounded-full flex flex-col items-center justify-center font-bold text-xs ${
                  node.isActive
                    ? 'bg-warning-light border-warning text-warning'
                    : node.isVisited
                    ? 'bg-success-light border-success text-success'
                    : 'bg-surface-elevated border-subtle text-primary'
                }`}
                style={{
                  left: node.x - 32,
                  top: node.y - 32,
                }}
              >
                <div>{node.label}</div>
                <div className="text-xs">
                  {node.distance === Infinity ? '∞' : node.distance}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Distance table */}
        <div className="bg-surface-elevated border border-subtle rounded p-4">
          <h4 className="font-semibold text-primary mb-3">Shortest Distances from {startNode}:</h4>
          <div className="grid grid-cols-5 gap-4 text-sm">
            {nodes.map(node => (
              <div key={node.id} className="text-center">
                <div className="font-medium text-primary">{node.label}</div>
                <div className="text-secondary">
                  {node.distance === Infinity ? '∞' : node.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default DijkstraBellmanVisualizer;
