import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';

const generateSortedArray = (length = 15, min = 1, max = 100) => {
  const arr = Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  return arr.sort((a, b) => a - b);
};

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>(generateSortedArray());
  const [target, setTarget] = useState('');
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const binarySearch = async () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) return;

    setIsSearching(true);
    setFound(null);
    setStep(0);
    setSearchHistory([]);

    let l = 0;
    let r = array.length - 1;
    let stepCount = 0;
    const history: string[] = [];

    while (l <= r) {
      setLeft(l);
      setRight(r);
      
      const m = Math.floor((l + r) / 2);
      setMid(m);
      setStep(++stepCount);
      
      const stepInfo = `Step ${stepCount}: Checking middle element at index ${m} (value: ${array[m]})`;
      history.push(stepInfo);
      setSearchHistory([...history]);
      
      await sleep(1500);

      if (array[m] === targetNum) {
        setFound(m);
        history.push(`✓ Found target ${targetNum} at index ${m}!`);
        setSearchHistory([...history]);
        break;
      } else if (array[m] < targetNum) {
        history.push(`${array[m]} < ${targetNum}, search right half (indices ${m + 1} to ${r})`);
        l = m + 1;
      } else {
        history.push(`${array[m]} > ${targetNum}, search left half (indices ${l} to ${m - 1})`);
        r = m - 1;
      }
      setSearchHistory([...history]);
    }

    if (l > r && found === null) {
      history.push(`✗ Target ${targetNum} not found in array`);
      setSearchHistory([...history]);
    }

    setIsSearching(false);
    setTimeout(() => {
      setLeft(null);
      setRight(null);
      setMid(null);
    }, 2000);
  };

  const handleReset = () => {
    setArray(generateSortedArray());
    setLeft(null);
    setRight(null);
    setMid(null);
    setFound(null);
    setStep(0);
    setSearchHistory([]);
    setTarget('');
  };

  const controls = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Search Target</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter target value"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isSearching && binarySearch()}
            disabled={isSearching}
            className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <button
            onClick={binarySearch}
            disabled={!target || isSearching}
            className="px-6 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      {/* Search Progress */}
      {step > 0 && (
        <div className="p-3 bg-accent-light border border-accent/20 rounded-lg">
          <div className="text-accent font-medium mb-2">Search Progress</div>
          <div className="text-sm text-secondary">
            Step {step} • Searching for: <span className="font-semibold text-primary">{target}</span>
          </div>
        </div>
      )}
      
      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Search Steps</label>
          <div className="max-h-40 overflow-y-auto bg-surface-elevated border border-subtle rounded-lg p-3">
            {searchHistory.map((step, index) => (
              <div key={index} className="text-sm text-secondary py-1 border-b border-subtle last:border-b-0">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <VisualizationLayout
      title="Binary Search Visualization"
      description="Binary search efficiently finds elements in sorted arrays by repeatedly dividing the search space in half. It compares the target with the middle element and eliminates half of the remaining elements."
      backLink="/algorithms"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "O(log n)",
        space: "O(1)"
      }}
      operations={[
        "Array must be sorted for binary search to work",
        "Compare target with middle element",
        "If target < middle, search left half",
        "If target > middle, search right half",
        "Repeat until target is found or search space is empty"
      ]}
    >
      <div className="w-full max-w-5xl">
        {/* Array Visualization */}
        <div className="space-y-6">
          {/* Search Range Indicators */}
          {(left !== null || right !== null) && (
            <div className="flex justify-center items-center gap-4 text-sm">
              {left !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-secondary">Left: {left}</span>
                </div>
              )}
              {mid !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-secondary">Mid: {mid}</span>
                </div>
              )}
              {right !== null && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-secondary">Right: {right}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Array Elements */}
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <AnimatePresence>
              {array.map((value, index) => (
                <motion.div
                  key={`${index}-${value}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-sm
                    transition-all duration-300
                    ${found === index 
                      ? 'bg-success-light border-success text-success shadow-lg scale-110' 
                      : mid === index
                      ? 'bg-accent-light border-accent text-accent shadow-md'
                      : left === index
                      ? 'bg-warning-light border-warning text-warning'
                      : right === index
                      ? 'bg-error-light border-error text-error'
                      : (left !== null && right !== null && index >= left && index <= right)
                      ? 'bg-surface-elevated border-accent/30 text-primary'
                      : 'bg-surface-elevated border-subtle text-muted opacity-50'
                    }
                  `}
                >
                  <div className="text-center">
                    <div>{value}</div>
                    <div className="text-xs opacity-75">{index}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Search Range Visualization */}
          {left !== null && right !== null && (
            <div className="flex justify-center">
              <div className="relative">
                <div className="text-sm text-secondary text-center">
                  Current Search Range: [{left}, {right}] • Size: {right - left + 1} elements
                </div>
                {mid !== null && (
                  <div className="text-xs text-accent text-center mt-1">
                    Checking middle element at index {mid}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Algorithm Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-secondary">
            Array Size: <span className="font-semibold text-primary">{array.length}</span>
            {step > 0 && (
              <>
                {' • '}
                Steps Taken: <span className="font-semibold text-primary">{step}</span>
                {' • '}
                Max Steps: <span className="font-semibold text-primary">{Math.ceil(Math.log2(array.length))}</span>
              </>
            )}
          </div>
          <div className="text-xs text-muted">
            Sorted Array • Logarithmic Time • Divide and Conquer
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
}
