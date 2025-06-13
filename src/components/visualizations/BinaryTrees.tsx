import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleKeyPress = (e: React.KeyboardEvent, action: string) => {
    if (e.key === 'Enter') {
      if (action === 'insert') {
        handleInsert();
      } else if (action === 'search') {
        animatedSearch();
      } else if (action === 'delete') {
        handleDelete();
      }
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Binary Search Tree Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Binary Search Trees maintain the BST property: left subtree values &lt; root &lt; right subtree values.
            This enables efficient O(log n) search, insertion, and deletion operations.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Insert Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Insert Node</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Value to insert"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleInsert}
                  disabled={!insertValue.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
            </div>

            {/* Search Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Search Node</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Value to search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'search')}
                  disabled={isSearching}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={animatedSearch}
                  disabled={!searchValue.trim() || isSearching}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Delete Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Delete Node</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Value to delete"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'delete')}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleDelete}
                  disabled={!deleteValue.trim()}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              disabled={isSearching}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Reset Tree
            </button>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {isSearching && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-700 font-semibold">🔍 Searching:</span>
                <span className="text-yellow-600 ml-2">Following BST property (left &lt; root &lt; right)</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-full" key={refreshKey}>
            {/* Tree Visualization */}
            <div className="relative min-h-[500px] bg-gray-50 rounded-xl border-2 border-gray-200 p-6">
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
                        absolute w-12 h-12 border-3 rounded-full flex items-center justify-center font-bold text-sm
                        transition-all duration-300 cursor-pointer shadow-md
                        ${highlightedNode === node.id
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 shadow-lg scale-110'
                          : searchPath.includes(node.id)
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:shadow-lg'
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
            <div className="mt-8 text-center space-y-3 border-t pt-6">
              <div className="text-lg text-gray-700">
                Tree Nodes: <span className="font-bold text-green-600">{bst.getAllNodes().length}</span>
              </div>
              <div className="text-sm text-gray-500">
                BST Property • Logarithmic operations • In-order traversal gives sorted sequence
              </div>

              {/* Complexity Information */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Search:</strong> O(log n) average, O(n) worst case</div>
                  <div><strong>Insert:</strong> O(log n) average, O(n) worst case</div>
                  <div><strong>Delete:</strong> O(log n) average, O(n) worst case</div>
                  <div><strong>Space:</strong> O(n) - Linear space for n nodes</div>
                </div>
              </div>

              {/* Operations Guide */}
              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">BST Operations</h3>
                <div className="text-sm text-green-700 space-y-1 text-left">
                  <div>• <strong>Insert:</strong> Add nodes while maintaining BST property</div>
                  <div>• <strong>Search:</strong> Follow left/right path based on value comparison</div>
                  <div>• <strong>Delete:</strong> Handle three cases (leaf, one child, two children)</div>
                  <div>• <strong>BST Property:</strong> left &lt; root &lt; right for all subtrees</div>
                </div>
              </div>

              {/* Python Code Example */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Python Implementation Example</h3>
                <div className="text-left">
                  <pre className="text-sm text-blue-700 font-mono bg-blue-100 p-3 rounded overflow-x-auto">
{`class TreeNode:
    def __init__(self, value=0, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        """Insert value maintaining BST property - O(log n) avg"""
        self.root = self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        if not node:
            return TreeNode(value)

        if value < node.value:
            node.left = self._insert_recursive(node.left, value)
        elif value > node.value:
            node.right = self._insert_recursive(node.right, value)

        return node

    def search(self, value):
        """Search for value - O(log n) avg"""
        return self._search_recursive(self.root, value)

    def _search_recursive(self, node, value):
        if not node or node.value == value:
            return node

        if value < node.value:
            return self._search_recursive(node.left, value)
        else:
            return self._search_recursive(node.right, value)

    def delete(self, value):
        """Delete value - O(log n) avg"""
        self.root = self._delete_recursive(self.root, value)

    def _delete_recursive(self, node, value):
        if not node:
            return node

        if value < node.value:
            node.left = self._delete_recursive(node.left, value)
        elif value > node.value:
            node.right = self._delete_recursive(node.right, value)
        else:
            # Node to delete found
            if not node.left:
                return node.right
            elif not node.right:
                return node.left

            # Node has two children
            min_node = self._find_min(node.right)
            node.value = min_node.value
            node.right = self._delete_recursive(node.right, min_node.value)

        return node

    def _find_min(self, node):
        while node.left:
            node = node.left
        return node

# Usage example
bst = BST()
values = [50, 30, 70, 20, 40, 60, 80]
for val in values:
    bst.insert(val)

print(f"Search 40: {bst.search(40) is not None}")  # True
bst.delete(30)
print("Deleted 30 from BST")`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
