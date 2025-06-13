import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ArrayElement {
  value: number;
  id: string;
  isComparing?: boolean;
  isMerging?: boolean;
  isInLeftHalf?: boolean;
  isInRightHalf?: boolean;
  isSorted?: boolean;
  level?: number;
}

interface MergeStep {
  array: ArrayElement[];
  left: number;
  right: number;
  level: number;
  description: string;
}

export default function DivideAndConquerVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 38, id: '0' },
    { value: 27, id: '1' },
    { value: 43, id: '2' },
    { value: 3, id: '3' },
    { value: 9, id: '4' },
    { value: 82, id: '5' },
    { value: 10, id: '6' },
    { value: 1, id: '7' }
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mergeSteps, setMergeSteps] = useState<MergeStep[]>([]);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);

  const resetVisualization = useCallback(() => {
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isMerging: false,
      isInLeftHalf: false,
      isInRightHalf: false,
      isSorted: false,
      level: 0
    })));
    setCurrentStep(0);
    setMergeSteps([]);
    setLastOperation(null);
    setCurrentLevel(0);
    setMaxLevel(0);
    setIsPlaying(false);
  }, []);

  const generateMergeSteps = useCallback((arr: ArrayElement[]): MergeStep[] => {
    const steps: MergeStep[] = [];
    const workingArray = [...arr];

    const mergeSort = (array: ArrayElement[], left: number, right: number, level: number) => {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      // Add divide step
      steps.push({
        array: [...array],
        left,
        right,
        level,
        description: `Divide: Split array [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`
      });

      // Recursively sort left and right halves
      mergeSort(array, left, mid, level + 1);
      mergeSort(array, mid + 1, right, level + 1);

      // Merge the sorted halves
      merge(array, left, mid, right, level);
    };

    const merge = (array: ArrayElement[], left: number, mid: number, right: number, level: number) => {
      const leftArray = array.slice(left, mid + 1);
      const rightArray = array.slice(mid + 1, right + 1);

      steps.push({
        array: [...array],
        left,
        right,
        level,
        description: `Merge: Combining sorted subarrays [${left}..${mid}] and [${mid + 1}..${right}]`
      });

      let i = 0, j = 0, k = left;

      while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i].value <= rightArray[j].value) {
          array[k] = { ...leftArray[i], isMerging: true };
          i++;
        } else {
          array[k] = { ...rightArray[j], isMerging: true };
          j++;
        }
        k++;
      }

      while (i < leftArray.length) {
        array[k] = { ...leftArray[i], isMerging: true };
        i++;
        k++;
      }

      while (j < rightArray.length) {
        array[k] = { ...rightArray[j], isMerging: true };
        j++;
        k++;
      }

      steps.push({
        array: [...array],
        left,
        right,
        level,
        description: `Merged: Subarray [${left}..${right}] is now sorted`
      });
    };

    mergeSort(workingArray, 0, workingArray.length - 1, 0);
    return steps;
  }, []);

  const startMergeSort = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    const steps = generateMergeSteps(array);
    setMergeSteps(steps);
    setMaxLevel(Math.ceil(Math.log2(array.length)));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(i + 1);
      setCurrentLevel(step.level);
      setLastOperation(step.description);

      // Update array visualization
      setArray(prev => prev.map((item, index) => ({
        ...item,
        isInLeftHalf: index >= step.left && index <= Math.floor((step.left + step.right) / 2),
        isInRightHalf: index > Math.floor((step.left + step.right) / 2) && index <= step.right,
        isMerging: step.array[index]?.isMerging || false,
        level: step.level
      })));

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Mark as completely sorted
    setArray(prev => prev.map(item => ({ ...item, isSorted: true, isMerging: false, isInLeftHalf: false, isInRightHalf: false })));
    setLastOperation('Merge sort completed! Array is now fully sorted.');
    setIsPlaying(false);
  }, [array, isPlaying, resetVisualization, generateMergeSteps]);

  const handleReset = () => {
    setArray([
      { value: 38, id: '0' },
      { value: 27, id: '1' },
      { value: 43, id: '2' },
      { value: 3, id: '3' },
      { value: 9, id: '4' },
      { value: 82, id: '5' },
      { value: 10, id: '6' },
      { value: 1, id: '7' }
    ]);
    resetVisualization();
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, (_, index) => ({
      value: Math.floor(Math.random() * 90) + 10,
      id: index.toString()
    }));
    setArray(newArray);
    resetVisualization();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Divide & Conquer: Merge Sort</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Merge sort uses the divide-and-conquer paradigm to sort arrays efficiently. It recursively divides
            the array into halves, sorts them separately, and then merges the sorted halves back together.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Buttons */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Controls</label>
              <div className="flex gap-3">
                <button
                  onClick={startMergeSort}
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPlaying ? 'Sorting...' : 'Start Merge Sort'}
                </button>
                <button
                  onClick={generateRandomArray}
                  disabled={isPlaying}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Random
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

            {/* Progress Info */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Progress</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Step</div>
                  <div className="text-lg font-bold text-green-600">{currentStep}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Level</div>
                  <div className="text-lg font-bold text-blue-600">{currentLevel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-semibold">Operation:</span>
                <span className="text-green-600 ml-2">{lastOperation}</span>
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
                    scale: element.isMerging ? 1.1 : 1,
                    y: element.isMerging ? -5 : 0
                  }}
                  className={`
                    w-16 h-16 border-3 rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-all duration-300 shadow-md
                    ${element.isSorted
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : element.isMerging
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                      : element.isInLeftHalf
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : element.isInRightHalf
                      ? 'bg-red-100 border-red-400 text-red-800'
                      : 'bg-white border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="text-lg">{element.value}</div>
                  <div className="text-xs text-gray-500">[{index}]</div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
                <span className="text-gray-600">Left Half</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
                <span className="text-gray-600">Right Half</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                <span className="text-gray-600">Merging</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
                <span className="text-gray-600">Sorted</span>
              </div>
            </div>

            {/* Recursion Tree Visualization */}
            {maxLevel > 0 && (
              <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recursion Depth</h3>
                <div className="flex justify-center items-center gap-2">
                  {Array.from({ length: maxLevel + 1 }, (_, level) => (
                    <div
                      key={level}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        level === currentLevel
                          ? 'bg-orange-100 border-orange-400 text-orange-800 scale-110'
                          : level < currentLevel
                          ? 'bg-green-100 border-green-400 text-green-800'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Current recursion level: {currentLevel} / {maxLevel}
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Array Size: <span className="font-bold text-green-600">{array.length}</span>
              {maxLevel > 0 && (
                <>
                  {' | '}
                  Max Depth: <span className="font-bold text-blue-600">{maxLevel}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Divide and conquer paradigm • Stable sorting • Guaranteed O(n log n) performance
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(n log n) - Consistent across all cases (best, average, worst)</div>
                <div><strong>Space:</strong> O(n) - Additional space for temporary arrays during merging</div>
                <div><strong>Stability:</strong> Yes - Maintains relative order of equal elements</div>
                <div><strong>Recursion Depth:</strong> O(log n) - Binary tree structure</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Divide & Conquer Steps</h3>
              <div className="text-sm text-green-700 space-y-1 text-left">
                <div>• <strong>Divide:</strong> Split array into two halves recursively</div>
                <div>• <strong>Conquer:</strong> Sort individual subarrays (base case: single elements)</div>
                <div>• <strong>Combine:</strong> Merge sorted subarrays back together</div>
                <div>• <strong>Recursion:</strong> Process continues until entire array is sorted</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def merge_sort(arr):
    """
    Merge sort implementation using divide and conquer
    Time: O(n log n), Space: O(n)
    """
    if len(arr) <= 1:
        return arr

    # Divide: Split array into two halves
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]

    # Conquer: Recursively sort both halves
    left_sorted = merge_sort(left_half)
    right_sorted = merge_sort(right_half)

    # Combine: Merge the sorted halves
    return merge(left_sorted, right_sorted)

def merge(left, right):
    """
    Merge two sorted arrays into one sorted array
    """
    result = []
    i = j = 0

    # Compare elements from both arrays and merge in sorted order
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Add remaining elements from left array
    while i < len(left):
        result.append(left[i])
        i += 1

    # Add remaining elements from right array
    while j < len(right):
        result.append(right[j])
        j += 1

    return result

# Usage example
unsorted_array = [38, 27, 43, 3, 9, 82, 10, 1]
sorted_array = merge_sort(unsorted_array)

print(f"Original: {unsorted_array}")
print(f"Sorted:   {sorted_array}")

# Time complexity analysis:
# - Divide: O(log n) levels in recursion tree
# - Merge: O(n) work at each level
# - Total: O(n) × O(log n) = O(n log n)

# Space complexity: O(n) for temporary arrays during merging`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
