import { useState, useCallback } from 'react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isHighlighted: boolean;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  isHighlighted: boolean;
}

export default function GraphsVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'A', label: 'A', x: 150, y: 100, isHighlighted: false },
    { id: 'B', label: 'B', x: 300, y: 100, isHighlighted: false },
    { id: 'C', label: 'C', x: 450, y: 100, isHighlighted: false },
    { id: 'D', label: 'D', x: 225, y: 200, isHighlighted: false },
    { id: 'E', label: 'E', x: 375, y: 200, isHighlighted: false },
  ]);

  const [edges, setEdges] = useState<GraphEdge[]>([
    { id: 'AB', from: 'A', to: 'B', weight: 5, isHighlighted: false },
    { id: 'BC', from: 'B', to: 'C', weight: 3, isHighlighted: false },
    { id: 'AD', from: 'A', to: 'D', weight: 2, isHighlighted: false },
    { id: 'BD', from: 'B', to: 'D', weight: 4, isHighlighted: false },
    { id: 'BE', from: 'B', to: 'E', weight: 6, isHighlighted: false },
    { id: 'CE', from: 'C', to: 'E', weight: 1, isHighlighted: false },
    { id: 'DE', from: 'D', to: 'E', weight: 7, isHighlighted: false },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDirected, setIsDirected] = useState(false);
  const [showWeights, setShowWeights] = useState(true);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (selectedNode === null) {
      setSelectedNode(nodeId);
      setNodes(prev => prev.map(node =>
        node.id === nodeId
          ? { ...node, isHighlighted: true }
          : { ...node, isHighlighted: false }
      ));
      setLastOperation(`Selected node ${nodeId}`);
    } else if (selectedNode === nodeId) {
      setSelectedNode(null);
      setNodes(prev => prev.map(node => ({ ...node, isHighlighted: false })));
      setLastOperation(`Deselected node ${nodeId}`);
    } else {
      // Create edge between selected node and clicked node
      const edgeId = `${selectedNode}${nodeId}`;
      const reverseEdgeId = `${nodeId}${selectedNode}`;

      const edgeExists = edges.some(edge =>
        edge.id === edgeId || edge.id === reverseEdgeId
      );

      if (!edgeExists) {
        const newEdge: GraphEdge = {
          id: edgeId,
          from: selectedNode,
          to: nodeId,
          weight: Math.floor(Math.random() * 9) + 1,
          isHighlighted: false
        };
        setEdges(prev => [...prev, newEdge]);
        setLastOperation(`Added edge from ${selectedNode} to ${nodeId}`);
      } else {
        setLastOperation(`Edge between ${selectedNode} and ${nodeId} already exists`);
      }

      setSelectedNode(null);
      setNodes(prev => prev.map(node => ({ ...node, isHighlighted: false })));
    }
  }, [selectedNode, edges]);

  const handleAddNode = useCallback(() => {
    if (!newNodeLabel.trim()) return;

    const newNode: GraphNode = {
      id: newNodeLabel,
      label: newNodeLabel,
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 100,
      isHighlighted: false
    };

    setNodes(prev => [...prev, newNode]);
    setNewNodeLabel('');
    setLastOperation(`Added node ${newNodeLabel}`);
  }, [newNodeLabel]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges(prev => prev.filter(edge => edge.id !== edgeId));
    setLastOperation(`Deleted edge ${edgeId}`);
  }, []);

  const handleReset = () => {
    setNodes([
      { id: 'A', label: 'A', x: 150, y: 100, isHighlighted: false },
      { id: 'B', label: 'B', x: 300, y: 100, isHighlighted: false },
      { id: 'C', label: 'C', x: 450, y: 100, isHighlighted: false },
      { id: 'D', label: 'D', x: 225, y: 200, isHighlighted: false },
      { id: 'E', label: 'E', x: 375, y: 200, isHighlighted: false },
    ]);
    setEdges([
      { id: 'AB', from: 'A', to: 'B', weight: 5, isHighlighted: false },
      { id: 'BC', from: 'B', to: 'C', weight: 3, isHighlighted: false },
      { id: 'AD', from: 'A', to: 'D', weight: 2, isHighlighted: false },
      { id: 'BD', from: 'B', to: 'D', weight: 4, isHighlighted: false },
      { id: 'BE', from: 'B', to: 'E', weight: 6, isHighlighted: false },
      { id: 'CE', from: 'C', to: 'E', weight: 1, isHighlighted: false },
      { id: 'DE', from: 'D', to: 'E', weight: 7, isHighlighted: false },
    ]);
    setSelectedNode(null);
    setNewNodeLabel('');
    setLastOperation(null);
  };

  const getNodeById = (id: string) => nodes.find(node => node.id === id);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Graph Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Graphs consist of vertices (nodes) connected by edges. They can be directed or undirected,
            weighted or unweighted, and are used to model relationships and networks.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Node */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Add Node</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Node label"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleAddNode}
                  disabled={!newNodeLabel.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Graph Options */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Graph Options</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDirected}
                    onChange={(e) => setIsDirected(e.target.checked)}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-gray-700">Directed</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showWeights}
                    onChange={(e) => setShowWeights(e.target.checked)}
                    className="rounded text-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show Weights</span>
                </label>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Reset Graph
            </button>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">Operation:</span>
                <span className="text-blue-600 ml-2">{lastOperation}</span>
              </div>
            )}

            <div className="text-sm text-gray-600">
              Click nodes to select them, then click another node to create an edge.
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6" style={{ height: '400px', position: 'relative' }}>
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Render edges */}
              {edges.map((edge) => {
                const fromNode = getNodeById(edge.from);
                const toNode = getNodeById(edge.to);
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
                      stroke="#6b7280"
                      strokeWidth="2"
                      className="cursor-pointer hover:stroke-red-500"
                      onClick={() => handleDeleteEdge(edge.id)}
                    />
                    {isDirected && (
                      <polygon
                        points={`${toNode.x - 10},${toNode.y - 5} ${toNode.x},${toNode.y} ${toNode.x - 10},${toNode.y + 5}`}
                        fill="#6b7280"
                      />
                    )}
                    {showWeights && edge.weight && (
                      <text
                        x={midX}
                        y={midY - 5}
                        textAnchor="middle"
                        className="text-xs fill-current text-gray-600 font-semibold"
                      >
                        {edge.weight}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute w-12 h-12 border-3 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all duration-200 shadow-md ${
                  node.isHighlighted
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-800 scale-110'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-lg'
                }`}
                style={{
                  left: node.x - 24,
                  top: node.y - 24,
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                {node.label}
              </div>
            ))}
          </div>

          {/* Graph Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Nodes: <span className="font-bold text-blue-600">{nodes.length}</span> |
              Edges: <span className="font-bold text-green-600">{edges.length}</span>
            </div>
            <div className="text-sm text-gray-500">
              Interactive graph builder • Click to connect nodes • Dynamic edge creation
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Add Vertex:</strong> O(1) - Constant time insertion</div>
                <div><strong>Add Edge:</strong> O(1) - Constant time for adjacency list</div>
                <div><strong>Search:</strong> O(V + E) - Visit all vertices and edges</div>
                <div><strong>Space:</strong> O(V + E) - Linear space for vertices and edges</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Graph Operations</h3>
              <div className="text-sm text-blue-700 space-y-1 text-left">
                <div>• <strong>Add Node:</strong> Enter label and click Add to create new vertices</div>
                <div>• <strong>Create Edge:</strong> Click one node, then another to connect them</div>
                <div>• <strong>Delete Edge:</strong> Click on any edge line to remove it</div>
                <div>• <strong>Toggle Direction:</strong> Switch between directed and undirected graphs</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`class Graph:
    def __init__(self, directed=False):
        self.directed = directed
        self.vertices = {}  # adjacency list representation

    def add_vertex(self, vertex):
        """Add a vertex to the graph - O(1)"""
        if vertex not in self.vertices:
            self.vertices[vertex] = []
            return True
        return False

    def add_edge(self, from_vertex, to_vertex, weight=1):
        """Add an edge between vertices - O(1)"""
        # Add vertices if they don't exist
        self.add_vertex(from_vertex)
        self.add_vertex(to_vertex)

        # Add edge
        self.vertices[from_vertex].append((to_vertex, weight))

        # If undirected, add reverse edge
        if not self.directed:
            self.vertices[to_vertex].append((from_vertex, weight))

    def remove_edge(self, from_vertex, to_vertex):
        """Remove edge between vertices - O(E)"""
        if from_vertex in self.vertices:
            self.vertices[from_vertex] = [
                (v, w) for v, w in self.vertices[from_vertex]
                if v != to_vertex
            ]

        if not self.directed and to_vertex in self.vertices:
            self.vertices[to_vertex] = [
                (v, w) for v, w in self.vertices[to_vertex]
                if v != from_vertex
            ]

    def get_neighbors(self, vertex):
        """Get all neighbors of a vertex - O(1)"""
        return self.vertices.get(vertex, [])

    def has_edge(self, from_vertex, to_vertex):
        """Check if edge exists - O(degree)"""
        if from_vertex not in self.vertices:
            return False
        return any(v == to_vertex for v, w in self.vertices[from_vertex])

    def display(self):
        """Display the graph"""
        for vertex in self.vertices:
            neighbors = [f"{v}({w})" for v, w in self.vertices[vertex]]
            print(f"{vertex}: {neighbors}")

# Usage example
graph = Graph(directed=False)
graph.add_edge('A', 'B', 5)
graph.add_edge('B', 'C', 3)
graph.add_edge('A', 'D', 2)
graph.add_edge('C', 'D', 4)

print("Graph structure:")
graph.display()
print(f"Neighbors of A: {graph.get_neighbors('A')}")
print(f"Has edge A-C: {graph.has_edge('A', 'C')}")`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
