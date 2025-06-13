import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface TreeNode {
  id: string;
  value: number;
  children: TreeNode[];
  x?: number;
  y?: number;
  isHighlighted?: boolean;
}

const TreesVisualizer: React.FC = () => {
  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    value: 50,
    children: [
      {
        id: 'left1',
        value: 30,
        children: [
          { id: 'left1-1', value: 20, children: [] },
          { id: 'left1-2', value: 40, children: [] }
        ]
      },
      {
        id: 'right1',
        value: 70,
        children: [
          { id: 'right1-1', value: 60, children: [] },
          { id: 'right1-2', value: 80, children: [] }
        ]
      }
    ]
  });

  const [inputValue, setInputValue] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  // Calculate positions for tree layout
  const calculatePositions = (node: TreeNode, x: number, y: number, level: number): TreeNode => {
    const spacing = 120 / (level + 1);
    const updatedNode = { ...node, x, y };
    
    if (node.children.length > 0) {
      const childrenWidth = (node.children.length - 1) * spacing;
      const startX = x - childrenWidth / 2;
      
      updatedNode.children = node.children.map((child, index) => 
        calculatePositions(child, startX + index * spacing, y + 80, level + 1)
      );
    }
    
    return updatedNode;
  };

  const positionedTree = calculatePositions(tree, 300, 50, 0);

  const findNode = (node: TreeNode, id: string): TreeNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const findPath = (node: TreeNode, targetValue: number, path: string[] = []): string[] | null => {
    const currentPath = [...path, node.id];
    
    if (node.value === targetValue) {
      return currentPath;
    }
    
    for (const child of node.children) {
      const result = findPath(child, targetValue, currentPath);
      if (result) return result;
    }
    
    return null;
  };

  const handleAddChild = useCallback(() => {
    if (!inputValue.trim() || !selectedNodeId) return;

    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newChild: TreeNode = {
      id: `node-${Date.now()}`,
      value,
      children: []
    };

    const updateNode = (node: TreeNode): TreeNode => {
      if (node.id === selectedNodeId) {
        return { ...node, children: [...node.children, newChild] };
      }
      return {
        ...node,
        children: node.children.map(updateNode)
      };
    };

    setTree(updateNode);
    setInputValue('');
    setLastOperation(`Added child ${value} to selected node`);
  }, [inputValue, selectedNodeId]);

  const handleSearch = useCallback(() => {
    if (!inputValue.trim()) return;

    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const path = findPath(positionedTree, value);
    if (path) {
      setHighlightedPath(path);
      setLastOperation(`Found ${value} at path: ${path.join(' → ')}`);
    } else {
      setHighlightedPath([]);
      setLastOperation(`Value ${value} not found in tree`);
    }

    setTimeout(() => {
      setHighlightedPath([]);
    }, 3000);
  }, [inputValue, positionedTree]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
    const node = findNode(positionedTree, nodeId);
    setLastOperation(node ? `Selected node with value ${node.value}` : null);
  }, [selectedNodeId, positionedTree]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (nodeId === 'root') return;

    const deleteFromNode = (node: TreeNode): TreeNode => {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== nodeId)
          .map(deleteFromNode)
      };
    };

    setTree(deleteFromNode);
    setSelectedNodeId(null);
    setLastOperation(`Deleted node ${nodeId}`);
  }, []);

  const handleReset = () => {
    setTree({
      id: 'root',
      value: 50,
      children: [
        {
          id: 'left1',
          value: 30,
          children: [
            { id: 'left1-1', value: 20, children: [] },
            { id: 'left1-2', value: 40, children: [] }
          ]
        },
        {
          id: 'right1',
          value: 70,
          children: [
            { id: 'right1-1', value: 60, children: [] },
            { id: 'right1-2', value: 80, children: [] }
          ]
        }
      ]
    });
    setInputValue('');
    setSelectedNodeId(null);
    setLastOperation(null);
    setHighlightedPath([]);
  };

  const renderNode = (node: TreeNode): JSX.Element => (
    <div key={node.id}>
      {/* Node */}
      <div
        className={`absolute w-12 h-12 border-2 rounded-full flex items-center justify-center font-bold cursor-pointer ${
          selectedNodeId === node.id
            ? 'bg-accent-light border-accent text-accent'
            : highlightedPath.includes(node.id)
            ? 'bg-warning-light border-warning text-warning'
            : 'bg-surface-elevated border-subtle text-primary'
        }`}
        style={{
          left: (node.x || 0) - 24,
          top: (node.y || 0) - 24,
        }}
        onClick={() => handleNodeClick(node.id)}
      >
        {node.value}
        {node.id !== 'root' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNode(node.id);
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-error text-inverse rounded-full text-xs"
          >
            ×
          </button>
        )}
      </div>

      {/* Edges to children */}
      {node.children.map((child) => (
        <svg
          key={`edge-${node.id}-${child.id}`}
          className="absolute pointer-events-none"
          style={{ left: 0, top: 0, width: '100%', height: '100%' }}
        >
          <line
            x1={node.x}
            y1={node.y}
            x2={child.x}
            y2={child.y}
            stroke="hsl(var(--color-border))"
            strokeWidth="2"
          />
        </svg>
      ))}

      {/* Render children */}
      {node.children.map(renderNode)}
    </div>
  );

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Add Child to Selected Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <button
              onClick={handleAddChild}
              disabled={!inputValue.trim() || !selectedNodeId}
              className="px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Add Child
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Search Value</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search value"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <button
              onClick={handleSearch}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-success text-inverse rounded disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {lastOperation && (
        <div className="p-3 bg-accent-light border border-accent/20 rounded text-accent text-sm">
          {lastOperation}
        </div>
      )}

      <div className="text-sm text-secondary">
        Click a node to select it, then add children. Click the × button to delete nodes.
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Tree Visualization"
      description="Trees are hierarchical data structures with a root node and child nodes. Each node can have multiple children, forming a branching structure ideal for representing hierarchical relationships."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Access: O(h), Search: O(n), Insert: O(1), Delete: O(1)",
        space: "O(n)"
      }}
      operations={[
        "Click nodes to select them",
        "Add children to selected nodes",
        "Search for values with path highlighting",
        "Delete nodes (except root)"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="relative bg-surface border border-subtle rounded" style={{ height: '400px' }}>
          {renderNode(positionedTree)}
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default TreesVisualizer;
