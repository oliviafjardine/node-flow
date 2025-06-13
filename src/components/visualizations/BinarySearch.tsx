import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ArrayElement {
  value: number;
  id: string;
  isTarget?: boolean;
  isLeft?: boolean;
  isRight?: boolean;
  isMid?: boolean;
  isFound?: boolean;
  isEliminated?: boolean;
}

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 2, id: '0' },
    { value: 5, id: '1' },
    { value: 8, id: '2' },
    { value: 12, id: '3' },
    { value: 16, id: '4' },
    { value: 23, id: '5' },
    { value: 38, id: '6' },
    { value: 45, id: '7' },
    { value: 56, id: '8' },
    { value: 67, id: '9' },
    { value: 78, id: '10' }
  ]);

  const [target, setTarget] = useState<string>('23');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);

  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [comparisons, setComparisons] = useState(0);

  const resetSearch = useCallback(() => {
    setArray(prev => prev.map(item => ({
      ...item,
      isTarget: false,
      isLeft: false,
      isRight: false,
      isMid: false,
      isFound: false,
      isEliminated: false
    })));
    setLeft(null);
    setRight(null);
    setMid(null);

    setSearchStep(0);
    setIsSearching(false);
    setLastOperation(null);
    setComparisons(0);
  }, []);

  const animatedBinarySearch = useCallback(async () => {
    if (!target.trim() || isSearching) return;

    resetSearch();
    setIsSearching(true);
    setComparisons(0);

    const targetValue = parseInt(target);
    let leftIdx = 0;
    let rightIdx = array.length - 1;
    let step = 0;
    let compCount = 0;

    while (leftIdx <= rightIdx) {
      step++;
      const midIdx = Math.floor((leftIdx + rightIdx) / 2);
      compCount++;

      // Update visualization
      setLeft(leftIdx);
      setRight(rightIdx);
      setMid(midIdx);
      setSearchStep(step);
      setComparisons(compCount);

      setArray(prev => prev.map((item, index) => ({
        ...item,
        isLeft: index === leftIdx,
        isRight: index === rightIdx,
        isMid: index === midIdx,
        isEliminated: index < leftIdx || index > rightIdx,
        isTarget: false,
        isFound: false
      })));

      setLastOperation(`Step ${step}: Checking middle element at index ${midIdx} (value: ${array[midIdx].value})`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (array[midIdx].value === targetValue) {
        // Found the target
        setArray(prev => prev.map((item, index) => ({
          ...item,
          isFound: index === midIdx,
          isMid: false
        })));
        setLastOperation(`Found target ${targetValue} at index ${midIdx} in ${step} steps!`);
        setIsSearching(false);
        return;
      } else if (array[midIdx].value < targetValue) {
        // Target is in the right half
        leftIdx = midIdx + 1;
        setLastOperation(`${array[midIdx].value} < ${targetValue}, search right half`);
      } else {
        // Target is in the left half
        rightIdx = midIdx - 1;
        setLastOperation(`${array[midIdx].value} > ${targetValue}, search left half`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Target not found
    setLastOperation(`Target ${targetValue} not found in the array after ${step} steps`);
    setIsSearching(false);
  }, [target, array, isSearching, resetSearch]);

  const handleReset = () => {
    setArray([
      { value: 2, id: '0' },
      { value: 5, id: '1' },
      { value: 8, id: '2' },
      { value: 12, id: '3' },
      { value: 16, id: '4' },
      { value: 23, id: '5' },
      { value: 38, id: '6' },
      { value: 45, id: '7' },
      { value: 56, id: '8' },
      { value: 67, id: '9' },
      { value: 78, id: '10' }
    ]);
    setTarget('23');
    resetSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      animatedBinarySearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Binary Search Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Binary search efficiently finds elements in sorted arrays by repeatedly dividing the search space in half.
            It achieves O(log n) time complexity by eliminating half of the remaining elements in each step.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Search Target</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter target value"
                  disabled={isSearching}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={animatedBinarySearch}
                  disabled={!target.trim() || isSearching}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Search Stats */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Search Statistics</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Step</div>
                  <div className="text-lg font-bold text-purple-600">{searchStep}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Comparisons</div>
                  <div className="text-lg font-bold text-green-600">{comparisons}</div>
                </div>
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
              Reset
            </button>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-purple-700 font-semibold">Status:</span>
                <span className="text-purple-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            {/* Array Visualization */}
            <div className="flex justify-center items-center gap-2 mb-8">
              {array.map((element, index) => (
                <motion.div
                  key={element.id}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: element.isMid ? 1.2 : element.isFound ? 1.3 : 1,
                    y: element.isMid ? -10 : element.isFound ? -15 : 0
                  }}
                  className={`
                    w-16 h-16 border-3 rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 shadow-md
                    ${element.isFound
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : element.isMid
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                      : element.isLeft
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : element.isRight
                      ? 'bg-red-100 border-red-400 text-red-800'
                      : element.isEliminated
                      ? 'bg-gray-200 border-gray-300 text-gray-500 opacity-50'
                      : 'bg-white border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="text-lg">{element.value}</div>
                  <div className="text-xs text-gray-500">[{index}]</div>
                </motion.div>
              ))}
            </div>

            {/* Search Range Indicators */}
            {(left !== null || right !== null || mid !== null) && (
              <div className="flex justify-center gap-8 mb-6">
                {left !== null && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-blue-600">Left</div>
                    <div className="text-lg text-blue-800">Index {left}</div>
                  </div>
                )}
                {mid !== null && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-yellow-600">Mid</div>
                    <div className="text-lg text-yellow-800">Index {mid}</div>
                  </div>
                )}
                {right !== null && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-red-600">Right</div>
                    <div className="text-lg text-red-800">Index {right}</div>
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
                <span className="text-gray-600">Left Pointer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                <span className="text-gray-600">Mid Pointer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
                <span className="text-gray-600">Right Pointer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
                <span className="text-gray-600">Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded opacity-50"></div>
                <span className="text-gray-600">Eliminated</span>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Array Size: <span className="font-bold text-purple-600">{array.length}</span>
              {searchStep > 0 && (
                <>
                  {' | '}
                  Max Steps: <span className="font-bold text-green-600">{Math.ceil(Math.log2(array.length))}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Sorted array required • Logarithmic time complexity • Divide and conquer approach
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(log n) - Eliminates half the search space each step</div>
                <div><strong>Space:</strong> O(1) - Constant space for iterative implementation</div>
                <div><strong>Prerequisite:</strong> Array must be sorted</div>
                <div><strong>Best Case:</strong> O(1) - Target is at middle position</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">How Binary Search Works</h3>
              <div className="text-sm text-purple-700 space-y-1 text-left">
                <div>• <strong>Compare:</strong> Check if target equals middle element</div>
                <div>• <strong>Eliminate:</strong> If target &lt; middle, search left half</div>
                <div>• <strong>Eliminate:</strong> If target &gt; middle, search right half</div>
                <div>• <strong>Repeat:</strong> Continue until target found or search space empty</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def binary_search(arr, target):
    """
    Binary search implementation - O(log n) time, O(1) space
    Returns index of target if found, -1 otherwise
    """
    left = 0
    right = len(arr) - 1

    while left <= right:
        # Calculate middle index (avoids overflow)
        mid = left + (right - left) // 2

        # Check if target is at middle
        if arr[mid] == target:
            return mid

        # If target is smaller, search left half
        elif arr[mid] > target:
            right = mid - 1

        # If target is larger, search right half
        else:
            left = mid + 1

    # Target not found
    return -1

def binary_search_recursive(arr, target, left=0, right=None):
    """
    Recursive binary search - O(log n) time, O(log n) space
    """
    if right is None:
        right = len(arr) - 1

    if left > right:
        return -1

    mid = left + (right - left) // 2

    if arr[mid] == target:
        return mid
    elif arr[mid] > target:
        return binary_search_recursive(arr, target, left, mid - 1)
    else:
        return binary_search_recursive(arr, target, mid + 1, right)

# Usage example
sorted_array = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78]
target = 23

# Iterative approach
index = binary_search(sorted_array, target)
print(f"Target {target} found at index: {index}")

# Recursive approach
index_recursive = binary_search_recursive(sorted_array, target)
print(f"Recursive result: {index_recursive}")

# Time complexity: O(log n) - each step eliminates half the elements
# Space complexity: O(1) iterative, O(log n) recursive (call stack)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
