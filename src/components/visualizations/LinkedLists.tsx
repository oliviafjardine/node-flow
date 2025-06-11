import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';
import AnimatedEdge from './shared/AnimatedEdge';

interface ListNode {
  id: string;
  value: number;
  next: string | null;
}

const generateRandomList = (length = 5) => {
  const nodes: ListNode[] = [];
  for (let i = 0; i < length; i++) {
    const id = `node-${i}`;
    nodes.push({
      id,
      value: Math.floor(Math.random() * 99) + 1,
      next: i < length - 1 ? `node-${i + 1}` : null
    });
  }
  return nodes;
};

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<ListNode[]>(generateRandomList());
  const [insertValue, setInsertValue] = useState('');
  const [insertPosition, setInsertPosition] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInsert = () => {
    const value = parseInt(insertValue);
    const position = parseInt(insertPosition);
    
    if (isNaN(value) || isNaN(position) || position < 0 || position > nodes.length) return;

    const newId = `node-${Date.now()}`;
    const newNode: ListNode = { id: newId, value, next: null };
    const newNodes = [...nodes];

    if (position === 0) {
      // Insert at head
      newNode.next = nodes.length > 0 ? nodes[0].id : null;
      newNodes.unshift(newNode);
    } else if (position === nodes.length) {
      // Insert at tail
      if (nodes.length > 0) {
        newNodes[nodes.length - 1].next = newId;
      }
      newNodes.push(newNode);
    } else {
      // Insert in middle
      newNode.next = newNodes[position].id;
      if (position > 0) {
        newNodes[position - 1].next = newId;
      }
      newNodes.splice(position, 0, newNode);
    }

    setNodes(newNodes);
    setInsertValue('');
    setInsertPosition('');
  };

  const handleDelete = (nodeId: string) => {
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;

    const newNodes = [...nodes];
    
    if (nodeIndex > 0) {
      // Update previous node's next pointer
      newNodes[nodeIndex - 1].next = newNodes[nodeIndex].next;
    }
    
    newNodes.splice(nodeIndex, 1);
    setNodes(newNodes);
  };

  const animatedSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    setIsSearching(true);
    setSearchResult(null);

    for (const node of nodes) {
      setHighlightedNode(node.id);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (node.value === value) {
        setSearchResult(node.id);
        break;
      }
    }

    setHighlightedNode(null);
    setIsSearching(false);
  };

  const handleReset = () => {
    setNodes(generateRandomList());
    setHighlightedNode(null);
    setSearchResult(null);
    setIsSearching(false);
    setInsertValue('');
    setInsertPosition('');
    setSearchValue('');
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Insert Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Position"
              value={insertPosition}
              onChange={(e) => setInsertPosition(e.target.value)}
              className="w-24 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={handleInsert}
              disabled={!insertValue || !insertPosition}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Insert
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Search Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Search Value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={animatedSearch}
              disabled={!searchValue || isSearching}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      <div className="space-y-2">
        {searchResult && (
          <div className="p-3 bg-success-light border border-success/20 rounded-lg">
            <span className="text-success font-medium">Found:</span> Value {searchValue} in the linked list
          </div>
        )}
        
        {isSearching && (
          <div className="p-3 bg-warning-light border border-warning/20 rounded-lg">
            <span className="text-warning font-medium">Searching:</span> Traversing nodes sequentially...
          </div>
        )}
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Linked List Visualization"
      description="Linked lists store data in nodes connected by pointers. They allow dynamic memory allocation and efficient insertion/deletion but require sequential access."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Access: O(n), Search: O(n), Insert: O(1), Delete: O(1)",
        space: "O(n)"
      }}
      operations={[
        "Insert nodes at any position (head, middle, or tail)",
        "Delete nodes by clicking the × button",
        "Search for values with animated traversal",
        "Observe pointer connections between nodes"
      ]}
    >
      <div className="w-full max-w-6xl">
        {/* Linked List Visualization */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Draw edges between nodes */}
            {nodes.map((node, index) => {
              if (index < nodes.length - 1) {
                const x1 = 100 + index * 120 + 48; // Node center + offset
                const y1 = 150;
                const x2 = 100 + (index + 1) * 120 + 16; // Next node start
                const y2 = 150;
                
                return (
                  <AnimatedEdge
                    key={`edge-${node.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    isDirected={true}
                    isHighlighted={highlightedNode === node.id}
                  />
                );
              }
              return null;
            })}
          </svg>
          
          {/* Nodes */}
          <div className="relative" style={{ zIndex: 2 }}>
            <AnimatePresence>
              {nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: index * 120,
                    y: 0
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  layout
                  className={`
                    absolute w-16 h-16 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center
                    transition-all duration-200 group
                    ${highlightedNode === node.id 
                      ? 'bg-warning-light border-warning text-warning shadow-lg' 
                      : searchResult === node.id
                      ? 'bg-success-light border-success text-success shadow-lg'
                      : 'bg-surface-elevated border-subtle text-primary hover:border-accent/30'
                    }
                  `}
                  style={{ left: 100, top: 120 }}
                >
                  <span className="font-bold text-sm">{node.value}</span>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(node.id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-error text-inverse rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-dark"
                  >
                    ×
                  </button>
                  
                  {/* Position indicator */}
                  <span className="absolute -bottom-6 text-xs text-muted">{index}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* NULL pointer at the end */}
          {nodes.length > 0 && (
            <div 
              className="absolute text-sm text-muted font-mono"
              style={{ 
                left: 100 + nodes.length * 120 + 20, 
                top: 145 
              }}
            >
              NULL
            </div>
          )}
        </div>
        
        {/* List Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-secondary">
            List Length: <span className="font-semibold text-primary">{nodes.length}</span>
          </div>
          <div className="text-xs text-muted">
            Memory: Dynamic allocation • Pointer-based traversal • Variable-size nodes
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
}
