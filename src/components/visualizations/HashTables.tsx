import { useState, useCallback } from 'react';

interface HashEntry {
  key: string;
  value: string;
  id: string;
}

interface HashBucket {
  entries: HashEntry[];
  isHighlighted: boolean;
}

export default function HashTablesVisualizer() {
  const TABLE_SIZE = 7;
  const [hashTable, setHashTable] = useState<HashBucket[]>(
    Array(TABLE_SIZE).fill(null).map(() => ({ entries: [], isHighlighted: false }))
  );
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);

  // Simple hash function
  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
  };

  const handleInsert = useCallback(() => {
    if (!inputKey.trim() || !inputValue.trim()) return;

    const index = hashFunction(inputKey);
    const newEntry: HashEntry = {
      key: inputKey,
      value: inputValue,
      id: `${inputKey}-${Date.now()}`
    };

    setHashTable(prev => {
      const newTable = [...prev];
      // Check if key already exists and update it
      const existingIndex = newTable[index].entries.findIndex(entry => entry.key === inputKey);
      if (existingIndex !== -1) {
        newTable[index].entries[existingIndex] = newEntry;
      } else {
        newTable[index].entries.push(newEntry);
      }
      return newTable;
    });

    setHighlightedBucket(index);
    setLastOperation(`Inserted "${inputKey}: ${inputValue}" at bucket ${index}`);
    setInputKey('');
    setInputValue('');

    setTimeout(() => {
      setHighlightedBucket(null);
    }, 2000);
  }, [inputKey, inputValue]);

  const handleSearch = useCallback(() => {
    if (!searchKey.trim()) return;

    const index = hashFunction(searchKey);
    setHighlightedBucket(index);

    const bucket = hashTable[index];
    const found = bucket.entries.find(entry => entry.key === searchKey);

    if (found) {
      setLastOperation(`Found "${searchKey}: ${found.value}" in bucket ${index}`);
    } else {
      setLastOperation(`Key "${searchKey}" not found in bucket ${index}`);
    }

    setTimeout(() => {
      setHighlightedBucket(null);
    }, 2000);
  }, [searchKey, hashTable]);

  const handleDelete = useCallback((key: string) => {
    const index = hashFunction(key);
    
    setHashTable(prev => {
      const newTable = [...prev];
      newTable[index].entries = newTable[index].entries.filter(entry => entry.key !== key);
      return newTable;
    });

    setHighlightedBucket(index);
    setLastOperation(`Deleted "${key}" from bucket ${index}`);

    setTimeout(() => {
      setHighlightedBucket(null);
    }, 2000);
  }, []);

  const handleReset = () => {
    setHashTable(Array(TABLE_SIZE).fill(null).map(() => ({ entries: [], isHighlighted: false })));
    setInputKey('');
    setInputValue('');
    setSearchKey('');
    setLastOperation(null);
    setHighlightedBucket(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: string) => {
    if (e.key === 'Enter') {
      if (action === 'insert') {
        handleInsert();
      } else if (action === 'search') {
        handleSearch();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hash Table Visualization</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hash tables use a hash function to map keys to array indices, providing O(1) average-case lookup,
            insertion, and deletion. Collisions are handled using separate chaining.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insert Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Insert Key-Value Pair</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'insert')}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleInsert}
                  disabled={!inputKey.trim() || !inputValue.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert
                </button>
              </div>
            </div>

            {/* Search Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Search Operations</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search key"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'search')}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchKey.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">✓ Operation:</span>
                <span className="text-blue-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hash Function Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hash Function</h3>
            <div className="text-gray-600 font-mono">
              hash(key) = Σ(character codes) % {TABLE_SIZE}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Simple hash function that sums ASCII values of characters and takes modulo {TABLE_SIZE}
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            <div className="space-y-4">
              {hashTable.map((bucket, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all duration-300 ${
                    highlightedBucket === index
                      ? 'bg-blue-100 border-blue-400 shadow-md'
                      : 'bg-white border-gray-200'
                  }`}
                >
                <div className="w-12 text-center font-mono text-lg font-bold text-gray-700">
                  [{index}]
                </div>
                <div className="flex-1 min-h-[50px] flex items-center gap-3">
                  {bucket.entries.length === 0 ? (
                    <span className="text-gray-400 text-sm italic">Empty bucket</span>
                  ) : (
                    bucket.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm"
                      >
                        <span className="text-sm">
                          <span className="font-bold text-gray-800">{entry.key}</span>
                          <span className="text-gray-500">: </span>
                          <span className="text-blue-600 font-medium">{entry.value}</span>
                        </span>
                        <button
                          onClick={() => handleDelete(entry.key)}
                          className="w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors"
                          title="Delete entry"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Hash Table Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Table Size: <span className="font-bold text-blue-600">{TABLE_SIZE}</span>
            </div>
            <div className="text-sm text-gray-500">
              Separate Chaining • O(1) average operations • Load factor management
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Insert:</strong> O(1) average, O(n) worst case</div>
                <div><strong>Search:</strong> O(1) average, O(n) worst case</div>
                <div><strong>Delete:</strong> O(1) average, O(n) worst case</div>
                <div><strong>Space:</strong> O(n) - Linear space for n key-value pairs</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Hash Table Operations</h3>
              <div className="text-sm text-blue-700 space-y-1 text-left">
                <div>• <strong>Insert:</strong> Add key-value pairs using hash function to determine bucket</div>
                <div>• <strong>Search:</strong> Find values by computing hash of the key</div>
                <div>• <strong>Collision Handling:</strong> Use separate chaining for multiple entries per bucket</div>
                <div>• <strong>Delete:</strong> Remove entries by key from their respective buckets</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`class HashTable:
    def __init__(self, size=7):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(char) for char in str(key)) % self.size

    def insert(self, key, value):
        index = self._hash(key)
        bucket = self.table[index]

        # Update if key exists
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return

        # Add new key-value pair
        bucket.append((key, value))

    def search(self, key):
        index = self._hash(key)
        bucket = self.table[index]

        for k, v in bucket:
            if k == key:
                return v
        return None

    def delete(self, key):
        index = self._hash(key)
        bucket = self.table[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return True
        return False

# Usage
hash_table = HashTable()
hash_table.insert("name", "Alice")
hash_table.insert("age", 25)
print(hash_table.search("name"))  # Output: Alice`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
