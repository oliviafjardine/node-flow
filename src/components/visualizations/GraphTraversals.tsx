import { useState } from 'react';
import { motion } from 'framer-motion';

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

export default function GraphTraversalsVisualizer() {
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
  const [lastOperation, setLastOperation] = useState<string | null>(null);

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

  const performBFS = async () => {
    const adjList = getAdjacencyList();
    const visited = new Set<string>();
    const queue = [startNode];
    const order: string[] = [];
    let step = 0;

    setQueue([startNode]);
    setLastOperation(`Starting BFS from node ${startNode}`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (visited.has(current)) continue;

      visited.add(current);
      order.push(current);

      setLastOperation(`Visiting node ${current} (step ${step + 1})`);

      // Update UI
      setNodes(prev => prev.map(node => ({
        ...node,
        isVisited: visited.has(node.id),
        isActive: node.id === current,
        visitOrder: visited.has(node.id) ? order.indexOf(node.id) + 1 : undefined
      })));

      setTraversalOrder([...order]);
      setCurrentStep(++step);

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add neighbors to queue
      const neighbors = adjList.get(current) || [];
      const newNeighbors: string[] = [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          newNeighbors.push(neighbor);
        }
      }

      if (newNeighbors.length > 0) {
        setLastOperation(`Added neighbors [${newNeighbors.join(', ')}] to queue`);
      }

      setQueue([...queue]);

      // Highlight edges to neighbors
      setEdges(prev => prev.map(edge => ({
        ...edge,
        isHighlighted: (edge.from === current || edge.to === current) &&
                      (visited.has(edge.from) || visited.has(edge.to))
      })));

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setQueue([]);
    setLastOperation(`BFS completed! Visited ${order.length} nodes in order: ${order.join(' → ')}`);
  };

  const performDFS = async () => {
    const adjList = getAdjacencyList();
    const visited = new Set<string>();
    const stack = [startNode];
    const order: string[] = [];
    let step = 0;

    setStack([startNode]);
    setLastOperation(`Starting DFS from node ${startNode}`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(current)) continue;

      visited.add(current);
      order.push(current);

      setLastOperation(`Visiting node ${current} (step ${step + 1})`);

      // Update UI
      setNodes(prev => prev.map(node => ({
        ...node,
        isVisited: visited.has(node.id),
        isActive: node.id === current,
        visitOrder: visited.has(node.id) ? order.indexOf(node.id) + 1 : undefined
      })));

      setTraversalOrder([...order]);
      setCurrentStep(++step);

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add neighbors to stack (in reverse order for consistent left-to-right traversal)
      const neighbors = (adjList.get(current) || []).reverse();
      const newNeighbors: string[] = [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          newNeighbors.push(neighbor);
        }
      }

      if (newNeighbors.length > 0) {
        setLastOperation(`Added neighbors [${newNeighbors.join(', ')}] to stack`);
      }

      setStack([...stack]);

      // Highlight edges to neighbors
      setEdges(prev => prev.map(edge => ({
        ...edge,
        isHighlighted: (edge.from === current || edge.to === current) &&
                      (visited.has(edge.from) || visited.has(edge.to))
      })));

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setStack([]);
    setLastOperation(`DFS completed! Visited ${order.length} nodes in order: ${order.join(' → ')}`);
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
    setLastOperation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Graph Traversal Algorithms</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            BFS explores nodes level by level using a queue, while DFS explores as far as possible
            along each branch using a stack. Both visit all reachable nodes in O(V + E) time.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'BFS' | 'DFS')}
                disabled={isTraversing}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors disabled:bg-gray-100"
              >
                <option value="BFS">Breadth-First Search (BFS)</option>
                <option value="DFS">Depth-First Search (DFS)</option>
              </select>
            </div>

            {/* Start Node Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Start Node</label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                disabled={isTraversing}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors disabled:bg-gray-100"
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
                  onClick={startTraversal}
                  disabled={isTraversing}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isTraversing ? 'Running...' : `Start ${algorithm}`}
                </button>
                <button
                  onClick={resetVisualization}
                  disabled={isTraversing}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Nodes Visited</div>
              <div className="text-lg font-bold text-teal-600">{traversalOrder.length} / {nodes.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Step</div>
              <div className="text-lg font-bold text-blue-600">{currentStep}</div>
            </div>
          </div>

          {/* Data Structure Display */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithm === 'BFS' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Queue (FIFO)</label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg min-h-[50px] flex items-center gap-2 flex-wrap">
                  {queue.length === 0 ? (
                    <span className="text-gray-500 text-sm">Empty</span>
                  ) : (
                    queue.map((node, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-blue-100 border border-blue-300 text-blue-800 rounded text-sm font-semibold"
                      >
                        {node}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {algorithm === 'DFS' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Stack (LIFO)</label>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg min-h-[50px] flex items-center gap-2 flex-wrap">
                  {stack.length === 0 ? (
                    <span className="text-gray-500 text-sm">Empty</span>
                  ) : (
                    stack.map((node, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-orange-100 border border-orange-300 text-orange-800 rounded text-sm font-semibold"
                      >
                        {node}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Traversal Order</label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg min-h-[50px] flex items-center gap-2 flex-wrap">
                {traversalOrder.length === 0 ? (
                  <span className="text-gray-500 text-sm">Not started</span>
                ) : (
                  traversalOrder.map((node, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-green-100 border border-green-300 text-green-800 rounded text-sm font-semibold"
                    >
                      {index + 1}. {node}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <span className="text-teal-700 font-semibold">Status:</span>
                <span className="text-teal-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            <div className="relative" style={{ height: '400px' }}>
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Render edges */}
                {edges.map((edge) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <motion.line
                      key={edge.id}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={edge.isHighlighted ? "#10b981" : "#d1d5db"}
                      strokeWidth={edge.isHighlighted ? "4" : "2"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
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
                  className={`absolute w-12 h-12 border-3 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-lg ${
                    node.isActive
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                      : node.isVisited
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                  style={{
                    left: node.x - 24,
                    top: node.y - 24,
                  }}
                >
                  {node.label}
                  {node.visitOrder && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {node.visitOrder}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                <span className="text-gray-600">Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded-full"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded-full"></div>
                <span className="text-gray-600">Visited</span>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Nodes: <span className="font-bold text-teal-600">{nodes.length}</span>
              {' | '}
              Edges: <span className="font-bold text-blue-600">{edges.length}</span>
              {traversalOrder.length > 0 && (
                <>
                  {' | '}
                  Visited: <span className="font-bold text-green-600">{traversalOrder.length}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Graph traversal • BFS uses queue (FIFO) • DFS uses stack (LIFO) • Both O(V + E)
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(V + E) - Visit each vertex once, examine each edge once</div>
                <div><strong>Space:</strong> O(V) - Queue/stack and visited set can hold at most V vertices</div>
                <div><strong>BFS:</strong> Explores level by level, finds shortest path in unweighted graphs</div>
                <div><strong>DFS:</strong> Explores as deep as possible, useful for topological sorting and cycle detection</div>
              </div>
            </div>

            {/* Algorithm Comparison */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Breadth-First Search (BFS)</h3>
                <div className="text-sm text-blue-700 space-y-1 text-left">
                  <div>• <strong>Data Structure:</strong> Queue (FIFO)</div>
                  <div>• <strong>Strategy:</strong> Explore level by level</div>
                  <div>• <strong>Use Cases:</strong> Shortest path, level-order traversal</div>
                  <div>• <strong>Memory:</strong> Can use more memory for wide graphs</div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Depth-First Search (DFS)</h3>
                <div className="text-sm text-orange-700 space-y-1 text-left">
                  <div>• <strong>Data Structure:</strong> Stack (LIFO)</div>
                  <div>• <strong>Strategy:</strong> Explore as deep as possible</div>
                  <div>• <strong>Use Cases:</strong> Topological sort, cycle detection</div>
                  <div>• <strong>Memory:</strong> More memory efficient for deep graphs</div>
                </div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`from collections import deque, defaultdict

class Graph:
    def __init__(self):
        self.graph = defaultdict(list)

    def add_edge(self, u, v):
        """Add edge to undirected graph"""
        self.graph[u].append(v)
        self.graph[v].append(u)

    def bfs(self, start):
        """
        Breadth-First Search using queue
        Time: O(V + E), Space: O(V)
        """
        visited = set()
        queue = deque([start])
        traversal_order = []

        while queue:
            # Dequeue from front (FIFO)
            current = queue.popleft()

            if current in visited:
                continue

            # Mark as visited and add to result
            visited.add(current)
            traversal_order.append(current)

            # Add unvisited neighbors to queue
            for neighbor in self.graph[current]:
                if neighbor not in visited:
                    queue.append(neighbor)

        return traversal_order

    def dfs_iterative(self, start):
        """
        Depth-First Search using stack (iterative)
        Time: O(V + E), Space: O(V)
        """
        visited = set()
        stack = [start]
        traversal_order = []

        while stack:
            # Pop from top (LIFO)
            current = stack.pop()

            if current in visited:
                continue

            # Mark as visited and add to result
            visited.add(current)
            traversal_order.append(current)

            # Add unvisited neighbors to stack
            # Reverse order for consistent left-to-right traversal
            for neighbor in reversed(self.graph[current]):
                if neighbor not in visited:
                    stack.append(neighbor)

        return traversal_order

    def dfs_recursive(self, start, visited=None):
        """
        Depth-First Search using recursion
        Time: O(V + E), Space: O(V) for recursion stack
        """
        if visited is None:
            visited = set()

        visited.add(start)
        traversal_order = [start]

        for neighbor in self.graph[start]:
            if neighbor not in visited:
                traversal_order.extend(
                    self.dfs_recursive(neighbor, visited)
                )

        return traversal_order

    def bfs_shortest_path(self, start, target):
        """
        Find shortest path using BFS
        Returns path and distance
        """
        if start == target:
            return [start], 0

        visited = set()
        queue = deque([(start, [start])])

        while queue:
            current, path = queue.popleft()

            if current in visited:
                continue

            visited.add(current)

            for neighbor in self.graph[current]:
                if neighbor == target:
                    return path + [neighbor], len(path)

                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))

        return None, -1  # No path found

    def is_connected(self):
        """Check if graph is connected using DFS"""
        if not self.graph:
            return True

        start = next(iter(self.graph))
        visited = set()
        self._dfs_visit(start, visited)

        return len(visited) == len(self.graph)

    def _dfs_visit(self, node, visited):
        """Helper for connectivity check"""
        visited.add(node)
        for neighbor in self.graph[node]:
            if neighbor not in visited:
                self._dfs_visit(neighbor, visited)

# Usage example
g = Graph()

# Build the graph from visualization
edges = [('A', 'B'), ('A', 'C'), ('B', 'D'), ('B', 'E'),
         ('C', 'F'), ('C', 'G'), ('D', 'E'), ('F', 'G')]

for u, v in edges:
    g.add_edge(u, v)

print("Graph adjacency list:")
for node in sorted(g.graph.keys()):
    print(f"{node}: {sorted(g.graph[node])}")

print("\\nBFS from A:", g.bfs('A'))
print("DFS (iterative) from A:", g.dfs_iterative('A'))
print("DFS (recursive) from A:", g.dfs_recursive('A'))

# Find shortest path
path, distance = g.bfs_shortest_path('A', 'G')
print(f"\\nShortest path A → G: {path}, distance: {distance}")

print(f"Is graph connected: {g.is_connected()}")

# Applications:
# BFS: Shortest path, level-order traversal, web crawling
# DFS: Topological sorting, cycle detection, maze solving`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
