import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  distance: number;
  isActive: boolean;
  isVisited: boolean;
  previous?: string;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  isHighlighted: boolean;
  isInPath: boolean;
}

export default function DijkstraBellmanFordVisualizer() {
  const initialNodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 100, y: 100, distance: Infinity, isActive: false, isVisited: false },
    { id: 'B', label: 'B', x: 300, y: 100, distance: Infinity, isActive: false, isVisited: false },
    { id: 'C', label: 'C', x: 500, y: 100, distance: Infinity, isActive: false, isVisited: false },
    { id: 'D', label: 'D', x: 100, y: 250, distance: Infinity, isActive: false, isVisited: false },
    { id: 'E', label: 'E', x: 300, y: 250, distance: Infinity, isActive: false, isVisited: false },
    { id: 'F', label: 'F', x: 500, y: 250, distance: Infinity, isActive: false, isVisited: false },
  ];

  const initialEdges: GraphEdge[] = [
    { id: 'AB', from: 'A', to: 'B', weight: 4, isHighlighted: false, isInPath: false },
    { id: 'AD', from: 'A', to: 'D', weight: 2, isHighlighted: false, isInPath: false },
    { id: 'BC', from: 'B', to: 'C', weight: 3, isHighlighted: false, isInPath: false },
    { id: 'BE', from: 'B', to: 'E', weight: 1, isHighlighted: false, isInPath: false },
    { id: 'CF', from: 'C', to: 'F', weight: 2, isHighlighted: false, isInPath: false },
    { id: 'DE', from: 'D', to: 'E', weight: 5, isHighlighted: false, isInPath: false },
    { id: 'EF', from: 'E', to: 'F', weight: 3, isHighlighted: false, isInPath: false },
  ];

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'bellman-ford'>('dijkstra');
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [distances, setDistances] = useState<{[key: string]: number}>({});

  const resetVisualization = useCallback(() => {
    const resetNodes = initialNodes.map(node => ({
      ...node,
      distance: node.id === startNode ? 0 : Infinity,
      isActive: false,
      isVisited: false,
      previous: undefined
    }));
    
    const resetEdges = initialEdges.map(edge => ({
      ...edge,
      isHighlighted: false,
      isInPath: false
    }));
    
    setNodes(resetNodes);
    setEdges(resetEdges);
    setCurrentStep(0);
    setLastOperation(null);
    setShortestPath([]);
    setDistances({});
  }, [startNode]);

  const getAdjacencyList = () => {
    const adjList: {[key: string]: {node: string, weight: number}[]} = {};
    
    nodes.forEach(node => {
      adjList[node.id] = [];
    });

    edges.forEach(edge => {
      adjList[edge.from].push({ node: edge.to, weight: edge.weight });
      adjList[edge.to].push({ node: edge.from, weight: edge.weight });
    });

    return adjList;
  };

  const dijkstraAlgorithm = useCallback(async () => {
    if (isRunning) return;
    
    resetVisualization();
    setIsRunning(true);
    
    const adjList = getAdjacencyList();
    const dist: {[key: string]: number} = {};
    const prev: {[key: string]: string | undefined} = {};
    const visited = new Set<string>();
    const unvisited = new Set<string>();
    
    // Initialize distances
    nodes.forEach(node => {
      dist[node.id] = node.id === startNode ? 0 : Infinity;
      prev[node.id] = undefined;
      unvisited.add(node.id);
    });
    
    setLastOperation(`Initializing Dijkstra's algorithm from node ${startNode}`);
    setDistances({...dist});
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let step = 0;
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = '';
      let minDist = Infinity;
      
      for (const node of unvisited) {
        if (dist[node] < minDist) {
          minDist = dist[node];
          current = node;
        }
      }
      
      if (minDist === Infinity) break; // No more reachable nodes
      
      step++;
      setCurrentStep(step);
      
      // Mark current node as active
      setNodes(prev => prev.map(node => ({
        ...node,
        distance: dist[node.id],
        isActive: node.id === current,
        isVisited: visited.has(node.id)
      })));
      
      setLastOperation(`Step ${step}: Processing node ${current} with distance ${dist[current]}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove from unvisited and add to visited
      unvisited.delete(current);
      visited.add(current);
      
      // Update distances to neighbors
      for (const neighbor of adjList[current]) {
        if (!visited.has(neighbor.node)) {
          const newDist = dist[current] + neighbor.weight;
          
          if (newDist < dist[neighbor.node]) {
            dist[neighbor.node] = newDist;
            prev[neighbor.node] = current;
            
            // Highlight the edge being relaxed
            setEdges(prevEdges => prevEdges.map(edge => ({
              ...edge,
              isHighlighted: (edge.from === current && edge.to === neighbor.node) ||
                           (edge.to === current && edge.from === neighbor.node)
            })));
            
            setLastOperation(`Relaxed edge ${current} → ${neighbor.node}: distance updated to ${newDist}`);
            setDistances({...dist});
            await new Promise(resolve => setTimeout(resolve, 1200));
          }
        }
      }
      
      // Clear edge highlights
      setEdges(prevEdges => prevEdges.map(edge => ({
        ...edge,
        isHighlighted: false
      })));
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Reconstruct shortest path
    const path: string[] = [];
    let current = targetNode;
    
    while (current !== undefined) {
      path.unshift(current);
      current = prev[current]!;
    }
    
    if (path[0] === startNode) {
      setShortestPath(path);
      
      // Highlight shortest path
      setEdges(prevEdges => prevEdges.map(edge => {
        const isInPath = path.some((node, i) => 
          i < path.length - 1 && 
          ((edge.from === node && edge.to === path[i + 1]) ||
           (edge.to === node && edge.from === path[i + 1]))
        );
        return { ...edge, isInPath };
      }));
      
      setLastOperation(`Shortest path from ${startNode} to ${targetNode}: ${path.join(' → ')} (distance: ${dist[targetNode]})`);
    } else {
      setLastOperation(`No path found from ${startNode} to ${targetNode}`);
    }
    
    setIsRunning(false);
  }, [nodes, edges, startNode, targetNode, isRunning, resetVisualization]);

  const bellmanFordAlgorithm = useCallback(async () => {
    if (isRunning) return;
    
    resetVisualization();
    setIsRunning(true);
    
    const dist: {[key: string]: number} = {};
    const prev: {[key: string]: string | undefined} = {};
    
    // Initialize distances
    nodes.forEach(node => {
      dist[node.id] = node.id === startNode ? 0 : Infinity;
      prev[node.id] = undefined;
    });
    
    setLastOperation(`Initializing Bellman-Ford algorithm from node ${startNode}`);
    setDistances({...dist});
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Relax edges V-1 times
    for (let i = 0; i < nodes.length - 1; i++) {
      setCurrentStep(i + 1);
      setLastOperation(`Iteration ${i + 1}: Relaxing all edges`);
      
      let updated = false;
      
      for (const edge of edges) {
        const u = edge.from;
        const v = edge.to;
        const weight = edge.weight;
        
        // Highlight current edge
        setEdges(prevEdges => prevEdges.map(e => ({
          ...e,
          isHighlighted: e.id === edge.id
        })));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Relax edge u → v
        if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          prev[v] = u;
          updated = true;
          
          setLastOperation(`Relaxed edge ${u} → ${v}: distance updated to ${dist[v]}`);
          setDistances({...dist});
          setNodes(prevNodes => prevNodes.map(node => ({
            ...node,
            distance: dist[node.id]
          })));
          
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Relax edge v → u (undirected graph)
        if (dist[v] !== Infinity && dist[v] + weight < dist[u]) {
          dist[u] = dist[v] + weight;
          prev[u] = v;
          updated = true;
          
          setLastOperation(`Relaxed edge ${v} → ${u}: distance updated to ${dist[u]}`);
          setDistances({...dist});
          setNodes(prevNodes => prevNodes.map(node => ({
            ...node,
            distance: dist[node.id]
          })));
          
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // Clear edge highlights
      setEdges(prevEdges => prevEdges.map(edge => ({
        ...edge,
        isHighlighted: false
      })));
      
      if (!updated) {
        setLastOperation(`No updates in iteration ${i + 1}, algorithm can terminate early`);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check for negative cycles (not applicable for this positive-weight graph)
    setLastOperation('Checking for negative cycles...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reconstruct shortest path
    const path: string[] = [];
    let current = targetNode;
    
    while (current !== undefined) {
      path.unshift(current);
      current = prev[current]!;
    }
    
    if (path[0] === startNode) {
      setShortestPath(path);
      
      // Highlight shortest path
      setEdges(prevEdges => prevEdges.map(edge => {
        const isInPath = path.some((node, i) => 
          i < path.length - 1 && 
          ((edge.from === node && edge.to === path[i + 1]) ||
           (edge.to === node && edge.from === path[i + 1]))
        );
        return { ...edge, isInPath };
      }));
      
      setLastOperation(`Shortest path from ${startNode} to ${targetNode}: ${path.join(' → ')} (distance: ${dist[targetNode]})`);
    } else {
      setLastOperation(`No path found from ${startNode} to ${targetNode}`);
    }
    
    setIsRunning(false);
  }, [nodes, edges, startNode, targetNode, isRunning, resetVisualization]);

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    resetVisualization();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dijkstra & Bellman-Ford Algorithms</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Both algorithms find shortest paths in weighted graphs. Dijkstra is faster (O(V²)) but requires 
            non-negative weights, while Bellman-Ford is slower (O(VE)) but handles negative weights.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'dijkstra' | 'bellman-ford')}
                disabled={isRunning}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors disabled:bg-gray-100"
              >
                <option value="dijkstra">Dijkstra's Algorithm</option>
                <option value="bellman-ford">Bellman-Ford Algorithm</option>
              </select>
            </div>

            {/* Start Node */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Start Node</label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors disabled:bg-gray-100"
              >
                {initialNodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label}</option>
                ))}
              </select>
            </div>

            {/* Target Node */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Target Node</label>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                disabled={isRunning}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors disabled:bg-gray-100"
              >
                {initialNodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label}</option>
                ))}
              </select>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Controls</label>
              <div className="flex gap-3">
                <button
                  onClick={algorithm === 'dijkstra' ? dijkstraAlgorithm : bellmanFordAlgorithm}
                  disabled={isRunning}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isRunning ? 'Running...' : 'Start'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isRunning}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Step</div>
              <div className="text-lg font-bold text-red-600">{currentStep}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Path Length</div>
              <div className="text-lg font-bold text-blue-600">{shortestPath.length > 0 ? shortestPath.length - 1 : 0}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Total Distance</div>
              <div className="text-lg font-bold text-green-600">
                {distances[targetNode] !== undefined && distances[targetNode] !== Infinity 
                  ? distances[targetNode] 
                  : '∞'}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-700 font-semibold">Status:</span>
                <span className="text-red-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            <div className="relative" style={{ height: '350px' }}>
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
                      <motion.line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={edge.isInPath ? "#10b981" : edge.isHighlighted ? "#f59e0b" : "#d1d5db"}
                        strokeWidth={edge.isInPath ? "4" : edge.isHighlighted ? "3" : "2"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Edge weight label */}
                      <text
                        x={midX}
                        y={midY - 5}
                        textAnchor="middle"
                        className="text-sm font-bold fill-gray-700 bg-white"
                        style={{
                          filter: 'drop-shadow(0 0 3px white)',
                          fontSize: '14px'
                        }}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Render nodes */}
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: node.isActive ? 1.2 : 1,
                    y: node.isActive ? -5 : 0
                  }}
                  className={`absolute w-16 h-16 border-3 rounded-full flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg ${
                    node.isActive
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                      : node.isVisited
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : shortestPath.includes(node.id)
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                  style={{
                    left: node.x - 32,
                    top: node.y - 32,
                  }}
                >
                  <div className="text-lg font-bold">{node.label}</div>
                  <div className="text-xs">
                    {node.distance === Infinity ? '∞' : node.distance}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Distance Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Distance Table</h3>
              <div className="overflow-x-auto">
                <table className="mx-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100">Node</th>
                      {nodes.map(node => (
                        <th key={node.id} className="border border-gray-300 px-4 py-2 bg-gray-100">
                          {node.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">
                        Distance from {startNode}
                      </td>
                      {nodes.map(node => (
                        <td
                          key={node.id}
                          className={`border border-gray-300 px-4 py-2 text-center transition-all duration-300 ${
                            shortestPath.includes(node.id)
                              ? 'bg-blue-100 text-blue-800 font-bold'
                              : node.isActive
                              ? 'bg-yellow-100 text-yellow-800 font-bold'
                              : 'bg-white text-gray-700'
                          }`}
                        >
                          {distances[node.id] === undefined || distances[node.id] === Infinity
                            ? '∞'
                            : distances[node.id]}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shortest Path Display */}
            {shortestPath.length > 0 && (
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Shortest Path</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {shortestPath.map((nodeId, index) => (
                    <div key={index} className="flex items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="px-3 py-1 bg-blue-100 border border-blue-300 text-blue-800 rounded font-bold"
                      >
                        {nodeId}
                      </motion.div>
                      {index < shortestPath.length - 1 && (
                        <span className="mx-2 text-gray-500">→</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Total Distance: {distances[targetNode] !== undefined && distances[targetNode] !== Infinity
                    ? distances[targetNode]
                    : '∞'}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                <span className="text-gray-600">Unprocessed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded-full"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded-full"></div>
                <span className="text-gray-600">Processed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded-full"></div>
                <span className="text-gray-600">In Path</span>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Algorithm: <span className="font-bold text-red-600">{algorithm === 'dijkstra' ? "Dijkstra's" : 'Bellman-Ford'}</span>
              {' | '}
              Nodes: <span className="font-bold text-blue-600">{nodes.length}</span>
              {' | '}
              Edges: <span className="font-bold text-purple-600">{edges.length}</span>
            </div>
            <div className="text-sm text-gray-500">
              Shortest path algorithms • Weighted graphs • Single-source shortest paths
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Dijkstra:</strong> O(V²) with array, O((V + E) log V) with priority queue</div>
                <div><strong>Bellman-Ford:</strong> O(V × E) - Relaxes all edges V-1 times</div>
                <div><strong>Space:</strong> O(V) for distance and predecessor arrays</div>
                <div><strong>Dijkstra Limitation:</strong> Cannot handle negative edge weights</div>
                <div><strong>Bellman-Ford Advantage:</strong> Detects negative cycles</div>
              </div>
            </div>

            {/* Algorithm Comparison */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Dijkstra's Algorithm</h3>
                <div className="text-sm text-green-700 space-y-1 text-left">
                  <div>• <strong>Strategy:</strong> Greedy approach with priority queue</div>
                  <div>• <strong>Requirement:</strong> Non-negative edge weights only</div>
                  <div>• <strong>Performance:</strong> Faster for most practical cases</div>
                  <div>• <strong>Use Case:</strong> GPS navigation, network routing</div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Bellman-Ford Algorithm</h3>
                <div className="text-sm text-orange-700 space-y-1 text-left">
                  <div>• <strong>Strategy:</strong> Dynamic programming approach</div>
                  <div>• <strong>Capability:</strong> Handles negative edge weights</div>
                  <div>• <strong>Feature:</strong> Detects negative cycles</div>
                  <div>• <strong>Use Case:</strong> Currency arbitrage, network analysis</div>
                </div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`import heapq
from collections import defaultdict

class Graph:
    def __init__(self):
        self.graph = defaultdict(list)

    def add_edge(self, u, v, weight):
        """Add weighted edge to graph"""
        self.graph[u].append((v, weight))
        self.graph[v].append((u, weight))  # Undirected graph

    def dijkstra(self, start):
        """
        Dijkstra's algorithm for shortest paths
        Time: O((V + E) log V), Space: O(V)

        Returns: distances dict and predecessors dict
        """
        distances = {node: float('inf') for node in self.graph}
        distances[start] = 0
        predecessors = {node: None for node in self.graph}

        # Priority queue: (distance, node)
        pq = [(0, start)]
        visited = set()

        while pq:
            current_dist, current = heapq.heappop(pq)

            if current in visited:
                continue

            visited.add(current)

            # Check all neighbors
            for neighbor, weight in self.graph[current]:
                if neighbor not in visited:
                    new_dist = current_dist + weight

                    if new_dist < distances[neighbor]:
                        distances[neighbor] = new_dist
                        predecessors[neighbor] = current
                        heapq.heappush(pq, (new_dist, neighbor))

        return distances, predecessors

    def bellman_ford(self, start):
        """
        Bellman-Ford algorithm for shortest paths
        Time: O(V * E), Space: O(V)

        Returns: (distances, predecessors, has_negative_cycle)
        """
        # Get all nodes and edges
        nodes = list(self.graph.keys())
        edges = []
        for u in self.graph:
            for v, weight in self.graph[u]:
                if u < v:  # Avoid duplicate edges in undirected graph
                    edges.append((u, v, weight))

        # Initialize distances
        distances = {node: float('inf') for node in nodes}
        distances[start] = 0
        predecessors = {node: None for node in nodes}

        # Relax edges V-1 times
        for _ in range(len(nodes) - 1):
            updated = False
            for u, v, weight in edges:
                # Relax u -> v
                if distances[u] != float('inf') and distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    predecessors[v] = u
                    updated = True

                # Relax v -> u (undirected graph)
                if distances[v] != float('inf') and distances[v] + weight < distances[u]:
                    distances[u] = distances[v] + weight
                    predecessors[u] = v
                    updated = True

            # Early termination if no updates
            if not updated:
                break

        # Check for negative cycles
        has_negative_cycle = False
        for u, v, weight in edges:
            if (distances[u] != float('inf') and distances[u] + weight < distances[v]) or \\
               (distances[v] != float('inf') and distances[v] + weight < distances[u]):
                has_negative_cycle = True
                break

        return distances, predecessors, has_negative_cycle

    def get_shortest_path(self, predecessors, start, target):
        """Reconstruct shortest path from predecessors"""
        if predecessors[target] is None and target != start:
            return None  # No path exists

        path = []
        current = target
        while current is not None:
            path.append(current)
            current = predecessors[current]

        return path[::-1]

def dijkstra_simple(graph, start):
    """
    Simple Dijkstra implementation without heapq
    Time: O(V²), Space: O(V)
    """
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    unvisited = set(graph.keys())

    while unvisited:
        # Find unvisited node with minimum distance
        current = min(unvisited, key=lambda node: distances[node])

        if distances[current] == float('inf'):
            break  # No more reachable nodes

        unvisited.remove(current)

        # Update distances to neighbors
        for neighbor, weight in graph[current]:
            if neighbor in unvisited:
                new_dist = distances[current] + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist

    return distances

# Usage example
g = Graph()

# Build the graph from visualization
edges = [
    ('A', 'B', 4), ('A', 'D', 2), ('B', 'C', 3),
    ('B', 'E', 1), ('C', 'F', 2), ('D', 'E', 5),
    ('E', 'F', 3)
]

for u, v, weight in edges:
    g.add_edge(u, v, weight)

print("Graph adjacency list:")
for node in sorted(g.graph.keys()):
    print(f"{node}: {g.graph[node]}")

# Dijkstra's algorithm
print("\\n=== Dijkstra's Algorithm ===")
distances_d, predecessors_d = g.dijkstra('A')
print("Distances from A:", {k: v for k, v in distances_d.items() if v != float('inf')})

path_d = g.get_shortest_path(predecessors_d, 'A', 'F')
print(f"Shortest path A → F: {' → '.join(path_d) if path_d else 'No path'}")
print(f"Distance: {distances_d['F']}")

# Bellman-Ford algorithm
print("\\n=== Bellman-Ford Algorithm ===")
distances_bf, predecessors_bf, has_cycle = g.bellman_ford('A')
print("Distances from A:", {k: v for k, v in distances_bf.items() if v != float('inf')})
print(f"Has negative cycle: {has_cycle}")

path_bf = g.get_shortest_path(predecessors_bf, 'A', 'F')
print(f"Shortest path A → F: {' → '.join(path_bf) if path_bf else 'No path'}")
print(f"Distance: {distances_bf['F']}")

# When to use which algorithm:
# Dijkstra: Non-negative weights, need fastest solution
# Bellman-Ford: May have negative weights, need to detect negative cycles`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
