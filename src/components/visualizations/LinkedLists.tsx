import { useState } from 'react';

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
  const [lastOperation, setLastOperation] = useState<'insert' | 'delete' | 'search' | null>(null);

  const handleInsert = () => {
    const value = parseInt(insertValue);
    const position = parseInt(insertPosition);
    
    if (isNaN(value) || isNaN(position) || position < 0 || position > nodes.length) return;
    if (insertValue.trim() === '' || insertPosition.trim() === '') return;

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

    // Update all node connections to maintain consistency
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
    setLastOperation('insert');
  };

  const handleDelete = (nodeId: string) => {
    if (isSearching) return;
    
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
    setLastOperation('delete');
  };

  const handleAccess = (nodeId: string) => {
    if (isSearching) return;
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;
    
    setHighlightedNode(nodeId);
    setSearchResult(null);
    setTimeout(() => setHighlightedNode(null), 2000);
  };

  const animatedSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value) || searchValue.trim() === '') return;

    setIsSearching(true);
    setSearchResult(null);
    setHighlightedNode(null);
    setLastOperation('search');

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setHighlightedNode(node.id);
      setCurrentSearchIndex(i);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (node.value === value) {
        setSearchResult(node.id);
        setCurrentSearchIndex(null);
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
    setLastOperation(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: string) => {
    if (e.key === 'Enter') {
      if (action === 'insert') {
        handleInsert();
      } else if (action === 'search') {
        animatedSearch();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Linked List Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Linked lists store data in nodes connected by pointers. They allow dynamic memory allocation and 
            efficient insertion/deletion but require sequential access for traversal.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Insert Controls */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Insert Node</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Value"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  disabled={isSearching}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <input
                  type="number"
                  placeholder="Position"
                  value={insertPosition}
                  onChange={(e) => setInsertPosition(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  disabled={isSearching}
                  className="w-24 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={handleInsert}
                  disabled={!insertValue.trim() || !insertPosition.trim() || isSearching || parseInt(insertPosition) < 0 || parseInt(insertPosition) > nodes.length}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Position range: 0 to {nodes.length} (0 = head, {nodes.length} = tail)
              </div>
            </div>

            {/* Search Controls */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Search Node</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Search Value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'search')}
                  disabled={isSearching}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={animatedSearch}
                  disabled={!searchValue.trim() || isSearching}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Sequential traversal from head to tail
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
              Reset List
            </button>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {highlightedNode && !isSearching && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-semibold">✓ Accessed:</span>
                <span className="text-green-600 ml-2">
                  Node at position {nodes.findIndex(n => n.id === highlightedNode)} with value {nodes.find(n => n.id === highlightedNode)?.value}
                </span>
              </div>
            )}

            {searchResult === 'not-found' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-700 font-semibold">✗ Not Found:</span>
                <span className="text-red-600 ml-2">{searchValue} not found in linked list</span>
              </div>
            )}

            {searchResult && searchResult !== 'not-found' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-semibold">✓ Found:</span>
                <span className="text-green-600 ml-2">
                  {searchValue} found at position {nodes.findIndex(n => n.id === searchResult)}
                </span>
              </div>
            )}
            
            {isSearching && currentSearchIndex !== null && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-700 font-semibold">🔍 Searching:</span>
                <span className="text-yellow-600 ml-2">
                  Checking position {currentSearchIndex} (value: {nodes[currentSearchIndex]?.value})
                </span>
              </div>
            )}

            {lastOperation === 'insert' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">✓ Inserted:</span>
                <span className="text-blue-600 ml-2">Node added to linked list</span>
              </div>
            )}

            {lastOperation === 'delete' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-orange-700 font-semibold">✓ Deleted:</span>
                <span className="text-orange-600 ml-2">Node removed from linked list</span>
              </div>
            )}
          </div>
        </div>

        {/* Linked List Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center items-center min-h-[240px] p-6 bg-gray-50 rounded-xl border-2 border-gray-200 overflow-x-auto">
            {nodes.length === 0 ? (
              <div className="text-center text-gray-500">
                <div className="text-2xl font-bold mb-2">Empty Linked List</div>
                <div className="text-lg">Insert nodes to get started</div>
              </div>
            ) : (
              <div className="flex items-center gap-4 min-w-max">
                {nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    {/* Node */}
                    <div
                      className={`
                        relative group cursor-pointer select-none transition-all duration-300
                        ${highlightedNode === node.id
                          ? 'transform scale-110'
                          : 'hover:scale-105'
                        }
                        ${isSearching && highlightedNode !== node.id ? 'opacity-50' : ''}
                      `}
                      onClick={() => handleAccess(node.id)}
                      style={{ 
                        cursor: isSearching ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <div className={`
                        w-20 h-20 border-3 rounded-xl flex flex-col items-center justify-center
                        transition-all duration-300 relative
                        ${highlightedNode === node.id
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 shadow-lg'
                          : searchResult === node.id
                          ? 'bg-green-100 border-green-400 text-green-800 shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:shadow-md'
                        }
                      `}>
                        <span className="font-bold text-lg">{node.value}</span>
                        <span className="text-xs text-gray-500 font-medium">[{index}]</span>

                        {/* Delete button */}
                        {!isSearching && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(node.id);
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center shadow-md"
                            title="Delete node"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Arrow to next node */}
                    {index < nodes.length - 1 && (
                      <div className="flex items-center mx-2">
                        <div className="w-8 h-0.5 bg-gray-400"></div>
                        <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    )}

                    {/* NULL pointer at the end */}
                    {index === nodes.length - 1 && (
                      <div className="flex items-center mx-2">
                        <div className="w-8 h-0.5 bg-gray-400"></div>
                        <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                        <div className="ml-2 text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded border">
                          NULL
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* List Info */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center gap-8 text-lg">
              <div className="text-gray-700">
                Length: <span className="font-bold text-green-600">{nodes.length}</span>
              </div>
              <div className="text-gray-700">
                Memory: <span className="font-bold text-green-600">Dynamic allocation</span>
              </div>
              <div className="text-gray-700">
                Head: <span className="font-bold text-green-600">{nodes.length > 0 ? `[0] = ${nodes[0].value}` : 'NULL'}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 max-w-2xl mx-auto">
              Sequential access • Pointer-based traversal • Dynamic node allocation
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Access:</strong> O(n) - Sequential traversal required</div>
                <div><strong>Search:</strong> O(n) - Linear search through nodes</div>
                <div><strong>Insert/Delete:</strong> O(1) with reference, O(n) to find position</div>
                <div><strong>Space:</strong> O(n) - Linear space for n nodes</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Linked List Operations</h3>
              <div className="text-sm text-green-700 space-y-1 text-left">
                <div>• <strong>Access:</strong> Click any node to access it (requires traversal)</div>
                <div>• <strong>Insert:</strong> Add nodes at specific positions (head, middle, or tail)</div>
                <div>• <strong>Search:</strong> Find nodes using animated sequential traversal</div>
                <div>• <strong>Delete:</strong> Remove nodes by clicking the × button</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-blue-700 font-mono bg-blue-100 p-3 rounded overflow-x-auto">
{`class ListNode:
    def __init__(self, value=0, next=None):
        self.value = value
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def insert_at_position(self, position, value):
        """Insert node at specific position - O(n)"""
        if position < 0 or position > self.size:
            raise IndexError("Position out of bounds")

        new_node = ListNode(value)

        if position == 0:  # Insert at head
            new_node.next = self.head
            self.head = new_node
        else:
            current = self.head
            for _ in range(position - 1):
                current = current.next
            new_node.next = current.next
            current.next = new_node

        self.size += 1

    def delete_at_position(self, position):
        """Delete node at position - O(n)"""
        if position < 0 or position >= self.size:
            raise IndexError("Position out of bounds")

        if position == 0:  # Delete head
            self.head = self.head.next
        else:
            current = self.head
            for _ in range(position - 1):
                current = current.next
            current.next = current.next.next

        self.size -= 1

    def search(self, value):
        """Search for value - O(n)"""
        current = self.head
        position = 0

        while current:
            if current.value == value:
                return position
            current = current.next
            position += 1

        return -1  # Not found

    def display(self):
        """Display the linked list"""
        result = []
        current = self.head
        while current:
            result.append(str(current.value))
            current = current.next
        return " -> ".join(result) + " -> NULL"

# Usage example
ll = LinkedList()
ll.insert_at_position(0, 10)  # Insert at head
ll.insert_at_position(1, 20)  # Insert at tail
ll.insert_at_position(1, 15)  # Insert in middle

print(ll.display())  # Output: 10 -> 15 -> 20 -> NULL
print(f"Search 15: position {ll.search(15)}")  # Output: 1`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}