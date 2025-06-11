import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';

const generateRandomArray = (length = 8, min = 1, max = 99) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export default function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>(generateRandomArray());
  const [accessIndex, setAccessIndex] = useState<number | null>(null);
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number | null>(null);

  const handleAccess = (index: number) => {
    setAccessIndex(index);
    setTimeout(() => setAccessIndex(null), 2000);
  };

  const handleInsert = () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);
    if (!isNaN(index) && !isNaN(value) && index >= 0 && index <= array.length) {
      const newArr = [...array];
      newArr.splice(index, 0, value);
      setArray(newArr);
      setInsertValue('');
      setInsertIndex('');
    }
  };

  const handleDelete = (index: number) => {
    const newArr = [...array];
    newArr.splice(index, 1);
    setArray(newArr);
  };

  const animatedSearch = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) return;

    setIsSearching(true);
    setSearchResult(null);

    for (let i = 0; i < array.length; i++) {
      setCurrentSearchIndex(i);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (array[i] === val) {
        setSearchResult(i);
        break;
      }
    }

    setCurrentSearchIndex(null);
    setIsSearching(false);
    if (searchResult === null && !array.includes(val)) {
      setSearchResult(-1);
    }
  };

  const handleReset = () => {
    setArray(generateRandomArray());
    setAccessIndex(null);
    setSearchResult(null);
    setCurrentSearchIndex(null);
    setIsSearching(false);
    setInsertValue('');
    setInsertIndex('');
    setSearchValue('');
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Insert Element</label>
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
              placeholder="Index"
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
              className="w-20 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={handleInsert}
              disabled={!insertValue || !insertIndex}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Insert
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Search Element</label>
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
        {accessIndex !== null && (
          <div className="p-3 bg-accent-light border border-accent/20 rounded-lg">
            <span className="text-accent font-medium">Accessed:</span> Value {array[accessIndex]} at index {accessIndex}
          </div>
        )}

        {searchResult !== null && (
          <div className={`p-3 border rounded-lg ${
            searchResult >= 0
              ? 'bg-success-light border-success/20 text-success'
              : 'bg-error-light border-error/20 text-error'
          }`}>
            {searchResult >= 0
              ? `Found ${searchValue} at index ${searchResult}`
              : `${searchValue} not found in array`
            }
          </div>
        )}
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Array Visualization"
      description="Arrays store elements in contiguous memory locations, allowing O(1) access by index but requiring O(n) time for insertion and deletion due to element shifting."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Access: O(1), Search: O(n), Insert/Delete: O(n)",
        space: "O(n)"
      }}
      operations={[
        "Click any element to access it directly using its index",
        "Insert elements at specific positions (elements shift right)",
        "Search for elements using linear search animation",
        "Delete elements by clicking the × button (elements shift left)"
      ]}
    >
      <div className="w-full max-w-4xl">
        {/* Array Visualization */}
        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px]">
          <AnimatePresence>
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
                className={`
                  relative w-16 h-16 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center
                  transition-all duration-200 group
                  ${accessIndex === index
                    ? 'bg-accent-light border-accent text-accent shadow-lg'
                    : currentSearchIndex === index
                    ? 'bg-warning-light border-warning text-warning'
                    : searchResult === index
                    ? 'bg-success-light border-success text-success'
                    : 'bg-surface-elevated border-subtle text-primary hover:border-accent/30'
                  }
                `}
                onClick={() => handleAccess(index)}
              >
                <span className="font-bold text-sm">{value}</span>
                <span className="text-xs text-muted">[{index}]</span>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-error text-inverse rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-dark"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Array Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-secondary">
            Array Length: <span className="font-semibold text-primary">{array.length}</span>
          </div>
          <div className="text-xs text-muted">
            Memory: Contiguous allocation • Index-based access • Fixed-size elements
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
}
