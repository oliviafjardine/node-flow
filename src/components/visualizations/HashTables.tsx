import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface HashEntry {
  key: string;
  value: string;
  id: string;
}

interface HashBucket {
  entries: HashEntry[];
  isHighlighted: boolean;
}

const HashTablesVisualizer: React.FC = () => {
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

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Insert Key-Value Pair</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Key"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <button
              onClick={handleInsert}
              disabled={!inputKey.trim() || !inputValue.trim()}
              className="px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Insert
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Search</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search key"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <button
              onClick={handleSearch}
              disabled={!searchKey.trim()}
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
    </div>
  );

  return (
    <VisualizationLayout
      title="Hash Table Visualization"
      description="Hash tables use a hash function to map keys to array indices, providing O(1) average-case lookup, insertion, and deletion. Collisions are handled using chaining."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Average: O(1) for all operations, Worst: O(n) with many collisions",
        space: "O(n)"
      }}
      operations={[
        "Insert key-value pairs using the hash function",
        "Search for keys by computing their hash",
        "Handle collisions using separate chaining",
        "Delete entries by key"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="space-y-6">
          {/* Hash Function Display */}
          <div className="text-center">
            <div className="text-sm text-secondary mb-2">Hash Function: hash(key) = Σ(char codes) % {TABLE_SIZE}</div>
          </div>

          {/* Hash Table Visualization */}
          <div className="space-y-2">
            {hashTable.map((bucket, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 border rounded ${
                  highlightedBucket === index
                    ? 'bg-accent-light border-accent'
                    : 'bg-surface border-subtle'
                }`}
              >
                <div className="w-8 text-center font-mono text-sm text-secondary">
                  [{index}]
                </div>
                <div className="flex-1 min-h-[40px] flex items-center gap-2">
                  {bucket.entries.length === 0 ? (
                    <span className="text-muted text-sm">Empty</span>
                  ) : (
                    bucket.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-2 px-3 py-1 bg-surface-elevated border border-subtle rounded"
                      >
                        <span className="text-sm">
                          <span className="font-medium text-primary">{entry.key}</span>
                          <span className="text-muted">: </span>
                          <span className="text-secondary">{entry.value}</span>
                        </span>
                        <button
                          onClick={() => handleDelete(entry.key)}
                          className="w-4 h-4 bg-error text-inverse rounded-full text-xs"
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
      </div>
    </VisualizationLayout>
  );
};

export default HashTablesVisualizer;
