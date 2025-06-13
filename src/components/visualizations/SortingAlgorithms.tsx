import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

interface ArrayItem {
  value: number;
  id: string;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isPivot?: boolean;
}

const generateRandomArray = (size = 12) => {
  return Array.from({ length: size }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 1,
    id: `item-${i}`,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
    isPivot: false
  }));
};

export default function SortingAlgorithmsVisualizer() {
  const [array, setArray] = useState<ArrayItem[]>(generateRandomArray());
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let steps = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isPlaying) return;
        
        // Highlight comparing elements
        arr[j].isComparing = true;
        arr[j + 1].isComparing = true;
        setArray([...arr]);
        setCurrentStep(++steps);
        await sleep(speed);

        if (arr[j].value > arr[j + 1].value) {
          // Highlight swapping elements
          arr[j].isSwapping = true;
          arr[j + 1].isSwapping = true;
          setArray([...arr]);
          await sleep(speed / 2);

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed / 2);

          arr[j].isSwapping = false;
          arr[j + 1].isSwapping = false;
        }

        arr[j].isComparing = false;
        arr[j + 1].isComparing = false;
      }
      
      // Mark as sorted
      arr[n - 1 - i].isSorted = true;
      setArray([...arr]);
    }
    
    arr[0].isSorted = true;
    setArray([...arr]);
    setTotalSteps(steps);
  }, [array, isPlaying, speed]);

  const selectionSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let steps = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      arr[i].isPivot = true;

      for (let j = i + 1; j < n; j++) {
        if (!isPlaying) return;
        
        arr[j].isComparing = true;
        setArray([...arr]);
        setCurrentStep(++steps);
        await sleep(speed);

        if (arr[j].value < arr[minIdx].value) {
          if (minIdx !== i) arr[minIdx].isComparing = false;
          minIdx = j;
        } else {
          arr[j].isComparing = false;
        }
      }

      if (minIdx !== i) {
        // Swap
        arr[i].isSwapping = true;
        arr[minIdx].isSwapping = true;
        setArray([...arr]);
        await sleep(speed);

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        
        arr[i].isSwapping = false;
        arr[minIdx].isSwapping = false;
      }

      arr[i].isPivot = false;
      arr[i].isComparing = false;
      arr[i].isSorted = true;
      if (minIdx !== i) arr[minIdx].isComparing = false;
      setArray([...arr]);
    }
    
    arr[n - 1].isSorted = true;
    setArray([...arr]);
    setTotalSteps(steps);
  }, [array, isPlaying, speed]);

  const insertionSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let steps = 0;

    arr[0].isSorted = true;
    setArray([...arr]);

    for (let i = 1; i < n; i++) {
      if (!isPlaying) return;
      
      const key = arr[i];
      key.isPivot = true;
      let j = i - 1;

      setArray([...arr]);
      await sleep(speed);

      while (j >= 0 && arr[j].value > key.value) {
        if (!isPlaying) return;
        
        arr[j].isComparing = true;
        setArray([...arr]);
        setCurrentStep(++steps);
        await sleep(speed);

        arr[j + 1] = arr[j];
        arr[j].isComparing = false;
        j--;
      }

      arr[j + 1] = key;
      key.isPivot = false;
      key.isSorted = true;
      
      // Mark all elements up to i as sorted
      for (let k = 0; k <= i; k++) {
        arr[k].isSorted = true;
      }
      
      setArray([...arr]);
    }
    
    setTotalSteps(steps);
  }, [array, isPlaying, speed]);

  const startSorting = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setTotalSteps(0);
    
    // Reset array state
    const resetArray = array.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isPivot: false
    }));
    setArray(resetArray);

    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
      default:
        break;
    }
    
    setIsPlaying(false);
  };

  const stopSorting = () => {
    setIsPlaying(false);
  };

  const resetArray = () => {
    setArray(generateRandomArray());
    setIsPlaying(false);
    setCurrentStep(0);
    setTotalSteps(0);
  };



  const getAlgorithmInfo = () => {
    const info: Record<SortingAlgorithm, { time: string; space: string; description: string }> = {
      bubble: {
        time: "O(n²)",
        space: "O(1)",
        description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order."
      },
      selection: {
        time: "O(n²)",
        space: "O(1)",
        description: "Finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion."
      },
      insertion: {
        time: "O(n²)",
        space: "O(1)",
        description: "Builds the sorted array one element at a time by inserting each element into its correct position."
      },
      merge: {
        time: "O(n log n)",
        space: "O(n)",
        description: "Divides the array into halves, sorts them recursively, and merges the sorted halves."
      },
      quick: {
        time: "O(n log n) average, O(n²) worst",
        space: "O(log n)",
        description: "Selects a pivot element and partitions the array around it, then recursively sorts the partitions."
      }
    };
    return info[algorithm];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sorting Algorithms Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {getAlgorithmInfo().description}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
                disabled={isPlaying}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
              </select>
            </div>

            {/* Speed Control */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Speed: {1100 - speed}ms</label>
              <input
                type="range"
                min="100"
                max="1000"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={isPlaying}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Controls</label>
              <div className="flex gap-3">
                <button
                  onClick={isPlaying ? stopSorting : startSorting}
                  disabled={false}
                  className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isPlaying ? 'Stop' : 'Start'}
                </button>
                <button
                  onClick={resetArray}
                  disabled={isPlaying}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {totalSteps > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-800 font-medium">{currentStep} / {totalSteps} steps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-200"
                  style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-full">
            {/* Array Visualization */}
            <div className="flex items-end justify-center gap-1 min-h-[300px] p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <AnimatePresence>
                {array.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`
                      relative flex flex-col items-center justify-end transition-all duration-200
                      ${item.isComparing ? 'bg-yellow-400' :
                        item.isSwapping ? 'bg-red-400' :
                        item.isSorted ? 'bg-green-400' :
                        item.isPivot ? 'bg-blue-400' : 'bg-gray-300'
                      }
                      border-2 rounded-t-lg shadow-sm
                      ${item.isComparing ? 'border-yellow-500' :
                        item.isSwapping ? 'border-red-500' :
                        item.isSorted ? 'border-green-500' :
                        item.isPivot ? 'border-blue-500' : 'border-gray-400'
                      }
                    `}
                    style={{
                      height: `${item.value * 2.5}px`,
                      width: '32px',
                      minHeight: '40px'
                    }}
                  >
                    <span className={`
                      text-xs font-bold mb-1
                      ${item.isComparing || item.isSwapping || item.isSorted || item.isPivot
                        ? 'text-white'
                        : 'text-gray-700'
                      }
                    `}>
                      {item.value}
                    </span>

                    {/* Index */}
                    <span className="absolute -bottom-6 text-xs text-gray-500">
                      {index}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
                <span className="text-gray-600">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 border border-red-500 rounded"></div>
                <span className="text-gray-600">Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 border border-green-500 rounded"></div>
                <span className="text-gray-600">Sorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 border border-blue-500 rounded"></div>
                <span className="text-gray-600">Key/Pivot</span>
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="mt-8 text-center space-y-3 border-t pt-6">
              <div className="text-lg text-gray-700">
                Algorithm: <span className="font-bold text-purple-600 capitalize">{algorithm} Sort</span>
              </div>
              <div className="text-sm text-gray-500">
                Interactive sorting visualization • Step-by-step animation • Real-time progress tracking
              </div>

              {/* Complexity Information */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Time:</strong> {getAlgorithmInfo().time}</div>
                  <div><strong>Space:</strong> {getAlgorithmInfo().space}</div>
                  <div><strong>Stability:</strong> {algorithm === 'bubble' || algorithm === 'insertion' ? 'Stable' : 'Unstable'}</div>
                  <div><strong>In-place:</strong> Yes (all shown algorithms)</div>
                </div>
              </div>

              {/* Operations Guide */}
              <div className="mt-4 bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">How It Works</h3>
                <div className="text-sm text-purple-700 space-y-1 text-left">
                  <div>• <strong>Compare:</strong> Elements being compared are highlighted in yellow</div>
                  <div>• <strong>Swap:</strong> Elements being swapped are highlighted in red</div>
                  <div>• <strong>Sorted:</strong> Sorted elements are highlighted in green</div>
                  <div>• <strong>Key/Pivot:</strong> Current key element is highlighted in blue</div>
                </div>
              </div>

              {/* Python Code Example */}
              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Python Implementation Example</h3>
                <div className="text-left">
                  <pre className="text-sm text-green-700 font-mono bg-green-100 p-3 rounded overflow-x-auto">
{algorithm === 'bubble' ? `def bubble_sort(arr):
    """Bubble Sort - O(n²) time, O(1) space"""
    n = len(arr)

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if they're in wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no swapping occurred, array is sorted
        if not swapped:
            break

    return arr

# Usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers.copy())
print(f"Original: {numbers}")
print(f"Sorted: {sorted_numbers}")` :
algorithm === 'selection' ? `def selection_sort(arr):
    """Selection Sort - O(n²) time, O(1) space"""
    n = len(arr)

    for i in range(n - 1):
        # Find minimum element in remaining array
        min_idx = i

        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j

        # Swap minimum element with first element
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]

    return arr

# Usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = selection_sort(numbers.copy())
print(f"Original: {numbers}")
print(f"Sorted: {sorted_numbers}")` : `def insertion_sort(arr):
    """Insertion Sort - O(n²) time, O(1) space"""
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        # Insert key at correct position
        arr[j + 1] = key

    return arr

# Usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = insertion_sort(numbers.copy())
print(f"Original: {numbers}")
print(f"Sorted: {sorted_numbers}")`}
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
