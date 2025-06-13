import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ArrayElement {
  value: number;
  index: number;
  dpValue?: number;
  isActive?: boolean;
  isInLIS?: boolean;
  isComparing?: boolean;
}

export default function DP3Visualizer() {
  const [array, setArray] = useState<number[]>([10, 9, 2, 5, 3, 7, 101, 18]);
  const [dpArray, setDpArray] = useState<number[]>([]);
  const [tailsArray, setTailsArray] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [lisLength, setLisLength] = useState(0);
  const [lisIndices, setLisIndices] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<'dp' | 'binary'>('dp');
  const [newValue, setNewValue] = useState('');

  const resetVisualization = useCallback(() => {
    setDpArray(Array(array.length).fill(1));
    setTailsArray([]);
    setCurrentStep(0);
    setCurrentIndex(0);
    setLastOperation(null);
    setLisLength(0);
    setLisIndices([]);
    setIsPlaying(false);
  }, [array.length]);

  const lisDP = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    const n = array.length;
    const dp = Array(n).fill(1);
    const parent = Array(n).fill(-1);

    setLastOperation('Initializing DP array with 1s (each element forms LIS of length 1)');
    setDpArray([...dp]);
    await new Promise(resolve => setTimeout(resolve, 2000));

    let step = 0;

    // Fill DP array
    for (let i = 1; i < n; i++) {
      setCurrentIndex(i);
      setLastOperation(`Processing element ${array[i]} at index ${i}`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      for (let j = 0; j < i; j++) {
        step++;
        setCurrentStep(step);

        setLastOperation(`Comparing arr[${j}]=${array[j]} with arr[${i}]=${array[i]}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (array[j] < array[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;
          setDpArray([...dp]);
          setLastOperation(`Found better LIS ending at ${i}: length ${dp[i]} (from index ${j})`);
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      }
    }

    // Find maximum length and reconstruct LIS
    let maxLength = Math.max(...dp);
    let maxIndex = dp.indexOf(maxLength);

    setLisLength(maxLength);
    setLastOperation(`Maximum LIS length: ${maxLength}, ending at index ${maxIndex}`);

    // Backtrack to find LIS indices
    const lis: number[] = [];
    let current = maxIndex;
    while (current !== -1) {
      lis.unshift(current);
      current = parent[current];
    }

    setLisIndices(lis);
    setLastOperation(`LIS indices: [${lis.join(', ')}], values: [${lis.map(i => array[i]).join(', ')}]`);
    setIsPlaying(false);
  }, [array, isPlaying, resetVisualization]);

  const lisBinarySearch = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    const n = array.length;
    const tails: number[] = [];
    const indices: number[] = [];

    setLastOperation('Starting binary search approach with tails array');
    await new Promise(resolve => setTimeout(resolve, 2000));

    for (let i = 0; i < n; i++) {
      setCurrentIndex(i);
      setCurrentStep(i + 1);

      const num = array[i];
      setLastOperation(`Processing element ${num} at index ${i}`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Binary search for position
      let left = 0, right = tails.length;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (tails[mid] < num) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }

      if (left === tails.length) {
        tails.push(num);
        indices.push(i);
        setLastOperation(`Extending LIS: added ${num} at position ${left}`);
      } else {
        tails[left] = num;
        indices[left] = i;
        setLastOperation(`Replacing tails[${left}] with ${num} for better future extensions`);
      }

      setTailsArray([...tails]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setLisLength(tails.length);
    setLastOperation(`Binary search complete! LIS length: ${tails.length}`);
    setIsPlaying(false);
  }, [array, isPlaying, resetVisualization]);

  const addElement = useCallback(() => {
    const value = parseInt(newValue);
    if (isNaN(value)) return;

    setArray(prev => [...prev, value]);
    setNewValue('');
    setLastOperation(`Added element ${value} to array`);
  }, [newValue]);

  const handleReset = () => {
    setArray([10, 9, 2, 5, 3, 7, 101, 18]);
    resetVisualization();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addElement();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">DP III: Longest Increasing Subsequence (LIS)</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            LIS finds the longest subsequence where elements are in strictly increasing order.
            Compare the O(n²) DP solution with the optimized O(n log n) binary search approach.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Algorithm</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="dp"
                    checked={algorithm === 'dp'}
                    onChange={(e) => setAlgorithm(e.target.value as 'dp')}
                    disabled={isPlaying}
                    className="text-indigo-500"
                  />
                  <span className="text-sm text-gray-700">O(n²) DP Approach</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="binary"
                    checked={algorithm === 'binary'}
                    onChange={(e) => setAlgorithm(e.target.value as 'binary')}
                    disabled={isPlaying}
                    className="text-indigo-500"
                  />
                  <span className="text-sm text-gray-700">O(n log n) Binary Search</span>
                </label>
              </div>
            </div>

            {/* Algorithm Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Controls</label>
              <div className="flex gap-3">
                <button
                  onClick={algorithm === 'dp' ? lisDP : lisBinarySearch}
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPlaying ? 'Running...' : `Start ${algorithm === 'dp' ? 'DP' : 'Binary Search'}`}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isPlaying}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Add Element */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Add Element</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Value"
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={addElement}
                  disabled={!newValue.trim() || isPlaying}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Index</div>
              <div className="text-lg font-bold text-indigo-600">{currentIndex}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">LIS Length</div>
              <div className="text-lg font-bold text-purple-600">{lisLength}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Step</div>
              <div className="text-lg font-bold text-blue-600">{currentStep}</div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <span className="text-indigo-700 font-semibold">Status:</span>
                <span className="text-indigo-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            {/* Array Display */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Input Array</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {array.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: index === currentIndex ? 1.1 : 1,
                      y: index === currentIndex ? -5 : 0
                    }}
                    className={`w-16 h-16 border-3 rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                      lisIndices.includes(index)
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : index === currentIndex
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-lg">{value}</div>
                    <div className="text-xs text-gray-500">[{index}]</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* DP Array (for DP approach) */}
            {algorithm === 'dp' && dpArray.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">DP Array (LIS length ending at each index)</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {dpArray.map((value, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 border-3 rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                        lisIndices.includes(index)
                          ? 'bg-purple-100 border-purple-400 text-purple-800'
                          : index === currentIndex
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-lg">{value}</div>
                      <div className="text-xs text-gray-500">dp[{index}]</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tails Array (for Binary Search approach) */}
            {algorithm === 'binary' && tailsArray.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Tails Array (Smallest ending elements)</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {tailsArray.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 border-3 rounded-lg flex flex-col items-center justify-center font-bold text-sm bg-orange-100 border-orange-400 text-orange-800 shadow-md"
                    >
                      <div className="text-lg">{value}</div>
                      <div className="text-xs text-gray-500">tails[{index}]</div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  Length of current LIS: {tailsArray.length}
                </div>
              </div>
            )}

            {/* LIS Result */}
            {lisIndices.length > 0 && algorithm === 'dp' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Longest Increasing Subsequence</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {lisIndices.map((index, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="w-16 h-16 border-3 rounded-lg flex flex-col items-center justify-center font-bold text-sm bg-green-100 border-green-400 text-green-800 shadow-md"
                    >
                      <div className="text-lg">{array[index]}</div>
                      <div className="text-xs text-gray-500">[{index}]</div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  LIS: [{lisIndices.map(i => array[i]).join(', ')}] with length {lisLength}
                </div>
              </div>
            )}

            {/* Algorithm Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">O(n²) DP Approach</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• dp[i] = max LIS length ending at index i</div>
                  <div>• For each i, check all j &lt; i where arr[j] &lt; arr[i]</div>
                  <div>• Time: O(n²), Space: O(n)</div>
                  <div>• Easy to reconstruct actual LIS</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">O(n log n) Binary Search</h4>
                <div className="text-sm text-orange-700 space-y-1">
                  <div>• Maintain tails[i] = smallest ending element of LIS of length i+1</div>
                  <div>• Binary search to find position for each element</div>
                  <div>• Time: O(n log n), Space: O(n)</div>
                  <div>• Only gives length, needs extra work for actual LIS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Array Length: <span className="font-bold text-indigo-600">{array.length}</span>
              {lisLength > 0 && (
                <>
                  {' | '}
                  LIS Length: <span className="font-bold text-purple-600">{lisLength}</span>
                  {' | '}
                  Efficiency: <span className="font-bold text-green-600">{((lisLength / array.length) * 100).toFixed(1)}%</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Longest increasing subsequence • Dynamic programming • Binary search optimization
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>DP Approach:</strong> O(n²) time, O(n) space - Check all previous elements</div>
                <div><strong>Binary Search:</strong> O(n log n) time, O(n) space - Binary search for position</div>
                <div><strong>Space Optimization:</strong> Both approaches use O(n) space for auxiliary arrays</div>
                <div><strong>Reconstruction:</strong> DP approach easily reconstructs LIS, binary search needs extra work</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-800 mb-2">LIS Algorithm Approaches</h3>
              <div className="text-sm text-indigo-700 space-y-1 text-left">
                <div>• <strong>DP State:</strong> dp[i] = length of LIS ending at index i</div>
                <div>• <strong>DP Transition:</strong> dp[i] = max(dp[j] + 1) for all j &lt; i where arr[j] &lt; arr[i]</div>
                <div>• <strong>Binary Search:</strong> Maintain array of smallest tail elements for each length</div>
                <div>• <strong>Optimization:</strong> Binary search reduces time from O(n²) to O(n log n)</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def lis_dp(arr):
    """
    O(n²) DP approach for LIS
    Time: O(n²), Space: O(n)

    Returns: (lis_length, lis_sequence)
    """
    if not arr:
        return 0, []

    n = len(arr)
    dp = [1] * n  # dp[i] = LIS length ending at index i
    parent = [-1] * n  # For reconstruction

    # Fill DP array
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j

    # Find maximum length and ending index
    max_length = max(dp)
    max_index = dp.index(max_length)

    # Reconstruct LIS
    lis = []
    current = max_index
    while current != -1:
        lis.append(arr[current])
        current = parent[current]

    return max_length, lis[::-1]

def lis_binary_search(arr):
    """
    O(n log n) binary search approach
    Time: O(n log n), Space: O(n)

    Returns: lis_length (only length, not sequence)
    """
    if not arr:
        return 0

    # tails[i] = smallest ending element of LIS of length i+1
    tails = []

    for num in arr:
        # Binary search for position
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid

        # If num is larger than all elements, extend LIS
        if left == len(tails):
            tails.append(num)
        else:
            # Replace element for better future extensions
            tails[left] = num

    return len(tails)

def lis_binary_search_with_sequence(arr):
    """
    O(n log n) approach that also reconstructs the sequence
    """
    if not arr:
        return 0, []

    n = len(arr)
    tails = []
    predecessors = [-1] * n
    indices = []  # indices[i] = index in original array for tails[i]

    for i, num in enumerate(arr):
        # Binary search
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid

        # Update predecessors
        if left > 0:
            predecessors[i] = indices[left - 1]

        # Update tails and indices
        if left == len(tails):
            tails.append(num)
            indices.append(i)
        else:
            tails[left] = num
            indices[left] = i

    # Reconstruct sequence
    lis = []
    current = indices[-1] if indices else -1
    while current != -1:
        lis.append(arr[current])
        current = predecessors[current]

    return len(tails), lis[::-1]

import bisect

def lis_using_bisect(arr):
    """
    Using Python's bisect module for cleaner binary search
    """
    tails = []

    for num in arr:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num

    return len(tails)

# Usage examples
arr = [10, 9, 2, 5, 3, 7, 101, 18]

# DP approach
length_dp, sequence_dp = lis_dp(arr)
print(f"DP Approach - Length: {length_dp}, LIS: {sequence_dp}")

# Binary search (length only)
length_bs = lis_binary_search(arr)
print(f"Binary Search - Length: {length_bs}")

# Binary search with sequence
length_bs_seq, sequence_bs = lis_binary_search_with_sequence(arr)
print(f"Binary Search with sequence - Length: {length_bs_seq}, LIS: {sequence_bs}")

# Using bisect
length_bisect = lis_using_bisect(arr)
print(f"Using bisect - Length: {length_bisect}")

# Performance comparison:
# DP: O(n²) - good for small arrays, easy to understand
# Binary Search: O(n log n) - better for large arrays, more complex`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
