import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';

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

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
            disabled={isPlaying}
            className="w-full px-3 py-2 border border-subtle rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Speed: {1100 - speed}ms</label>
          <input
            type="range"
            min="100"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={isPlaying}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Progress */}
      {totalSteps > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Progress</span>
            <span className="text-primary">{currentStep} / {totalSteps} steps</span>
          </div>
          <div className="w-full bg-surface-elevated rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-200"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

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
    <VisualizationLayout
      title="Sorting Algorithms Visualization"
      description={getAlgorithmInfo().description}
      backLink="/algorithms"
      onReset={resetArray}
      isPlaying={isPlaying}
      onPlayPause={isPlaying ? stopSorting : startSorting}
      controls={controls}
      complexity={{
        time: getAlgorithmInfo().time,
        space: getAlgorithmInfo().space
      }}
      operations={[
        "Compare: Elements being compared are highlighted in yellow",
        "Swap: Elements being swapped are highlighted in red",
        "Sorted: Sorted elements are highlighted in green",
        "Pivot: Current key element is highlighted in blue"
      ]}
    >
      <div className="w-full max-w-5xl">
        {/* Array Visualization */}
        <div className="flex items-end justify-center gap-1 min-h-[300px] p-4">
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
                  ${item.isComparing ? 'bg-warning' : 
                    item.isSwapping ? 'bg-error' : 
                    item.isSorted ? 'bg-success' : 
                    item.isPivot ? 'bg-accent' : 'bg-surface-elevated'
                  }
                  border-2 rounded-t-lg
                  ${item.isComparing ? 'border-warning' : 
                    item.isSwapping ? 'border-error' : 
                    item.isSorted ? 'border-success' : 
                    item.isPivot ? 'border-accent' : 'border-subtle'
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
                    ? 'text-inverse' 
                    : 'text-primary'
                  }
                `}>
                  {item.value}
                </span>
                
                {/* Index */}
                <span className="absolute -bottom-6 text-xs text-muted">
                  {index}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded"></div>
            <span className="text-secondary">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-error rounded"></div>
            <span className="text-secondary">Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-secondary">Sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent rounded"></div>
            <span className="text-secondary">Key/Pivot</span>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
}
