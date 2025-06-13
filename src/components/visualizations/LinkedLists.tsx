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
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number | null>(null);

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

    // Update all node IDs and connections to maintain consistency
    for (let i = 0; i < newNodes.length; i++) {
      if (i < newNodes.length - 1) {
        newNodes[i].next = newNodes[i + 1].id;
      } else {
        newNodes[i].next = null;
      }
    }

    setNodes(newNodes);
    setInsertValue('');
    setInsertPosition('');
    setSearchResult(null);
    setHighlightedNode(null);
  };

  const handleDelete = (nodeId: string) => {
    if (isSearching) return; // Prevent deletion during search
    
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;

    const newNodes = [...nodes];
    newNodes.splice(nodeIndex, 1);
    
    // Update connections
    for (let i = 0; i < newNodes.length; i++) {
      if (i < newNodes.length - 1) {
        newNodes[i].next = newNodes[i + 1].id;
      } else {
        newNodes[i].next = null;
      }
    }

    setNodes(newNodes);
    setSearchResult(null);
    setHighlightedNode(null);
  };

  const animatedSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    setIsSearching(true);
    setSearchResult(null);
    setHighlightedNode(null);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setHighlightedNode(node.id);
      setCurrentSearchIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (node.value === value) {
        setSearchResult(node.id);
        setCurrentSearchIndex(null);
        setHighlightedNode(null);
        setIsSearching(false);
        return;
      }
    }

    setHighlightedNode(null);
    setCurrentSearchIndex(null);
    setIsSearching(false);
    setSearchResult('not-found');
  };

  const handleReset = () => {
    setNodes(generateRandomList());
    setHighlightedNode(null);
    setSearchResult(null);
    setIsSearching(false);
    setCurrentSearchIndex(null);
    setInsertValue('');
    setInsertPosition('');
    setSearchValue('');
  };

  const controls = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-primary">Insert Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              disabled={isSearching}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
            <input
              type="number"
              placeholder="Position"
              value={insertPosition}
              onChange={(e) => setInsertPosition(e.target.value)}
              disabled={isSearching}
              className="w-24 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={handleInsert}
              disabled={!insertValue || insertPosition === '' || isSearching || parseInt(insertPosition) < 0 || parseInt(insertPosition) > nodes.length}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Insert
            </button>
          </div>
          <div className="text-xs text-muted">
            Position range: 0 to {nodes.length} (0 = head, {nodes.length} = tail)
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-primary">Search Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Search Value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isSearching}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={animatedSearch}
              disabled={!searchValue || isSearching}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="text-xs text-muted">
            Sequential traversal from head to tail
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      <div className="space-y-3">
        {searchResult === 'not-found' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-error-light border border-error/20 rounded-lg"
          >
            <span className="text-error font-medium">Not Found:</span> Value {searchValue} is not in the linked list
          </motion.div>
        )}

        {searchResult && searchResult !== 'not-found' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-success-light border border-success/20 rounded-lg"
          >
            <span className="text-success font-medium">Found:</span> Value {searchValue} in the linked list
          </motion.div>
        )}
        
        {isSearching && currentSearchIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-warning-light border border-warning/20 rounded-lg"
          >
            <span className="text-warning font-medium">Searching:</span> Checking position {currentSearchIndex} (value: {nodes[currentSearchIndex]?.value})
          </motion.div>
        )}
      </div>
    </div>
  );

  // Calculate responsive positioning
  const getNodePosition = (index: number) => {
    const baseSpacing = Math.min(150, Math.max(120, (window?.innerWidth || 1200) / Math.max(nodes.length + 1, 6)));
    return {
      x: index * baseSpacing,
      centerX: index * baseSpacing + 40 // Node center for arrows
    };
  };

  return (
    <VisualizationLayout
      title="Linked List Visualization"
      description="Linked lists store data in nodes connected by pointers. They allow dynamic memory allocation and efficient insertion/deletion but require sequential access."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Access: O(n), Search: O(n), Insert: O(1)*, Delete: O(1)*",
        space: "O(n)"
      }}
      operations={[
        "Insert nodes at any position (head, middle, or tail)",
        "Delete nodes by clicking the × button",
        "Search for values with animated traversal",
        "Observe pointer connections between nodes"
      ]}
    >
      <div className="w-full max-w-7xl">
        {/* Linked List Visualization */}
        <div className="relative min-h-[320px] bg-surface-elevated rounded-xl border border-subtle p-8 overflow-x-auto">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Empty Linked List</div>
                <div className="text-sm">Add some nodes to get started</div>
              </div>
            </div>
          ) : (
            <>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {/* Draw edges between nodes */}
                {nodes.map((node, index) => {
                  if (index < nodes.length - 1) {
                    const pos1 = getNodePosition(index);
                    const pos2 = getNodePosition(index + 1);
                    const x1 = 60 + pos1.centerX + 40; // End of current node
                    const y1 = 160;
                    const x2 = 60 + pos2.centerX - 40; // Start of next node
                    const y2 = 160;
                    
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
                <AnimatePresence mode="popLayout">
                  {nodes.map((node, index) => {
                    const pos = getNodePosition(index);
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          x: pos.x,
                          y: 0
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        layout
                        transition={{ 
                          layout: { duration: 0.3 },
                          default: { duration: 0.2 }
                        }}
                        className={`
                          absolute w-20 h-20 border-2 rounded-xl cursor-pointer flex flex-col items-center justify-center
                          transition-all duration-300 group select-none
                          ${highlightedNode === node.id 
                            ? 'bg-warning-light border-warning text-warning shadow-lg transform scale-105' 
                            : searchResult === node.id
                            ? 'bg-success-light border-success text-success shadow-lg transform scale-105'
                            : 'bg-surface border-subtle text-primary hover:border-accent/50 hover:shadow-md'
                          }
                          ${isSearching && highlightedNode !== node.id ? 'opacity-60' : ''}
                        `}
                        style={{ left: 60, top: 120 }}
                      >
                        <span className="font-bold text-lg">{node.value}</span>
                        
                        {/* Delete button */}
                        {!isSearching && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(node.id);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-error text-inverse rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-dark flex items-center justify-center"
                            title="Delete node"
                          >
                            ×
                          </button>
                        )}
                        
                        {/* Position indicator */}
                        <span className="absolute -bottom-8 text-xs text-muted font-medium bg-surface-elevated px-2 py-1 rounded border border-subtle">
                          pos: {index}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              {/* NULL pointer at the end */}
              {nodes.length > 0 && (
                <div 
                  className="absolute text-sm text-muted font-mono bg-surface-elevated px-2 py-1 rounded border border-subtle"
                  style={{ 
                    left: 60 + getNodePosition(nodes.length).x + 20, 
                    top: 155,
                    zIndex: 2
                  }}
                >
                  NULL
                </div>
              )}
            </>
          )}
        </div>
        
        {/* List Info */}
        <div className="mt-6 text-center space-y-3">
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-secondary">
              Length: <span className="font-semibold text-primary">{nodes.length}</span>
            </div>
            <div className="text-secondary">
              Memory: <span className="font-semibold text-primary">Dynamic allocation</span>
            </div>
          </div>
          <div className="text-xs text-muted max-w-md mx-auto">
            Sequential access • Pointer-based traversal • Dynamic node allocation
          </div>
          <div className="text-xs text-muted">
            *Insert/Delete are O(1) when you have a reference to the node, O(n) when searching for position
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
}