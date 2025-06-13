import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

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

const GraphsVisualizer: React.FC = () => {
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

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Add Node</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="Node label"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <button
              onClick={handleAddNode}
              disabled={!newNodeLabel.trim()}
              className="px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Graph Options</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isDirected}
                onChange={(e) => setIsDirected(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Directed</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showWeights}
                onChange={(e) => setShowWeights(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Weights</span>
            </label>
          </div>
        </div>
      </div>

      {lastOperation && (
        <div className="p-3 bg-accent-light border border-accent/20 rounded text-accent text-sm">
          {lastOperation}
        </div>
      )}

      <div className="text-sm text-secondary">
        Click nodes to select them, then click another node to create an edge.
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Graph Visualization"
      description="Graphs consist of vertices (nodes) connected by edges. They can be directed or undirected, weighted or unweighted, and are used to model relationships and networks."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Access: O(1), Search: O(V+E), Insert: O(1), Delete: O(E)",
        space: "O(V + E)"
      }}
      operations={[
        "Click nodes to select and create edges",
        "Add new nodes with custom labels",
        "Toggle between directed and undirected graphs",
        "View edge weights and relationships"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="relative bg-surface border border-subtle rounded" style={{ height: '400px' }}>
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
                    stroke="hsl(var(--color-border))"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => handleDeleteEdge(edge.id)}
                  />
                  {isDirected && (
                    <polygon
                      points={`${toNode.x - 10},${toNode.y - 5} ${toNode.x},${toNode.y} ${toNode.x - 10},${toNode.y + 5}`}
                      fill="hsl(var(--color-border))"
                    />
                  )}
                  {showWeights && edge.weight && (
                    <text
                      x={midX}
                      y={midY - 5}
                      textAnchor="middle"
                      className="text-xs fill-current text-secondary"
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
              className={`absolute w-12 h-12 border-2 rounded-full flex items-center justify-center font-bold cursor-pointer ${
                node.isHighlighted
                  ? 'bg-accent-light border-accent text-accent'
                  : 'bg-surface-elevated border-subtle text-primary'
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
      </div>
    </VisualizationLayout>
  );
};

export default GraphsVisualizer;
