import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';
import AnimatedEdge from './shared/AnimatedEdge';

interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

class BST {
  root: TreeNode | null = null;

  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: TreeNode | null, value: number): TreeNode {
    if (!node) {
      return {
        id: `node-${value}-${Date.now()}`,
        value,
        left: null,
        right: null
      };
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  search(value: number): TreeNode | null {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node || node.value === value) {
      return node;
    }

    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else {
      return this.searchNode(node.right, value);
    }
  }

  delete(value: number): void {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(node: TreeNode | null, value: number): TreeNode | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Node to delete found
      if (!node.left && !node.right) {
        return null;
      } else if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      } else {
        // Node has two children
        const minRight = this.findMin(node.right);
        node.value = minRight.value;
        node.right = this.deleteNode(node.right, minRight.value);
      }
    }

    return node;
  }

  private findMin(node: TreeNode): TreeNode {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  calculatePositions(): void {
    if (!this.root) return;
    this.assignPositions(this.root, 400, 50, 200);
  }

  private assignPositions(node: TreeNode, x: number, y: number, offset: number): void {
    node.x = x;
    node.y = y;

    if (node.left) {
      this.assignPositions(node.left, x - offset, y + 80, offset / 2);
    }
    if (node.right) {
      this.assignPositions(node.right, x + offset, y + 80, offset / 2);
    }
  }

  getAllNodes(): TreeNode[] {
    const nodes: TreeNode[] = [];
    this.traverseInOrder(this.root, nodes);
    return nodes;
  }

  private traverseInOrder(node: TreeNode | null, nodes: TreeNode[]): void {
    if (node) {
      this.traverseInOrder(node.left, nodes);
      nodes.push(node);
      this.traverseInOrder(node.right, nodes);
    }
  }
}

export default function BinaryTreeVisualizer() {
  const [bst] = useState(() => {
    const tree = new BST();
    [50, 30, 70, 20, 40, 60, 80].forEach(val => tree.insert(val));
    tree.calculatePositions();
    return tree;
  });
  
  const [insertValue, setInsertValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInsert = () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) return;

    bst.insert(value);
    bst.calculatePositions();
    setInsertValue('');
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = () => {
    const value = parseInt(deleteValue);
    if (isNaN(value)) return;

    bst.delete(value);
    bst.calculatePositions();
    setDeleteValue('');
    setRefreshKey(prev => prev + 1);
  };

  const animatedSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    setIsSearching(true);
    setSearchPath([]);
    setHighlightedNode(null);

    const path: string[] = [];
    let current = bst.root;

    while (current) {
      path.push(current.id);
      setSearchPath([...path]);
      setHighlightedNode(current.id);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      if (current.value === value) {
        break;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    setIsSearching(false);
    setTimeout(() => {
      setHighlightedNode(null);
      setSearchPath([]);
    }, 2000);
  };

  const handleReset = () => {
    const newBst = new BST();
    [50, 30, 70, 20, 40, 60, 80].forEach(val => newBst.insert(val));
    newBst.calculatePositions();
    Object.assign(bst, newBst);
    setRefreshKey(prev => prev + 1);
    setHighlightedNode(null);
    setSearchPath([]);
    setInsertValue('');
    setSearchValue('');
    setDeleteValue('');
  };

  const renderEdges = () => {
    const edges: React.ReactElement[] = [];
    
    const addEdges = (node: TreeNode) => {
      if (node.left && node.x && node.y && node.left.x && node.left.y) {
        edges.push(
          <AnimatedEdge
            key={`edge-${node.id}-left`}
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            isHighlighted={searchPath.includes(node.id) && searchPath.includes(node.left.id)}
          />
        );
        addEdges(node.left);
      }
      
      if (node.right && node.x && node.y && node.right.x && node.right.y) {
        edges.push(
          <AnimatedEdge
            key={`edge-${node.id}-right`}
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            isHighlighted={searchPath.includes(node.id) && searchPath.includes(node.right.id)}
          />
        );
        addEdges(node.right);
      }
    };

    if (bst.root) {
      addEdges(bst.root);
    }

    return edges;
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Insert Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value to insert"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={handleInsert}
              disabled={!insertValue}
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
              placeholder="Value to search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={animatedSearch}
              disabled={!searchValue || isSearching}
              className="px-4 py-2 bg-warning text-inverse rounded-lg hover:bg-warning-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Delete Node</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value to delete"
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={handleDelete}
              disabled={!deleteValue}
              className="px-4 py-2 bg-error text-inverse rounded-lg hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      {isSearching && (
        <div className="p-3 bg-warning-light border border-warning/20 rounded-lg">
          <span className="text-warning font-medium">Searching:</span> Following BST property (left &lt; root &lt; right)
        </div>
      )}
    </div>
  );

  return (
    <VisualizationLayout
      title="Binary Search Tree Visualization"
      description="Binary Search Trees maintain the BST property: left subtree values < root < right subtree values. This enables efficient O(log n) search, insertion, and deletion operations."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Search/Insert/Delete: O(log n) average, O(n) worst",
        space: "O(n)"
      }}
      operations={[
        "Insert: Add nodes while maintaining BST property",
        "Search: Follow left/right path based on value comparison",
        "Delete: Handle three cases (leaf, one child, two children)",
        "BST property: left < root < right for all subtrees"
      ]}
    >
      <div className="w-full max-w-6xl" key={refreshKey}>
        {/* Tree Visualization */}
        <div className="relative min-h-[500px]">
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {renderEdges()}
          </svg>
          
          <div className="relative" style={{ zIndex: 2 }}>
            <AnimatePresence>
              {bst.getAllNodes().map((node) => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`
                    absolute w-12 h-12 border-2 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-200 cursor-pointer
                    ${highlightedNode === node.id 
                      ? 'bg-warning-light border-warning text-warning shadow-lg scale-110' 
                      : searchPath.includes(node.id)
                      ? 'bg-accent-light border-accent text-accent'
                      : 'bg-surface-elevated border-subtle text-primary hover:border-accent/30'
                    }
                  `}
                  style={{
                    left: (node.x || 0) - 24,
                    top: (node.y || 0) - 24
                  }}
                >
                  {node.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Tree Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-secondary">
            Tree Nodes: <span className="font-semibold text-primary">{bst.getAllNodes().length}</span>
          </div>
          <div className="text-xs text-muted">
            BST Property • Logarithmic operations • In-order traversal gives sorted sequence
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
}
