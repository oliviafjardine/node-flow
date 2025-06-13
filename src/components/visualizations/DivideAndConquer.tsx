import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface MergeSortStep {
  array: number[];
  left: number;
  right: number;
  level: number;
  isActive: boolean;
  isMerging: boolean;
}

const DivideAndConquerVisualizer: React.FC = () => {
  const [originalArray] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [steps, setSteps] = useState<MergeSortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generateMergeSortSteps = (arr: number[]): MergeSortStep[] => {
    const steps: MergeSortStep[] = [];
    const workingArray = [...arr];

    const mergeSort = (array: number[], left: number, right: number, level: number) => {
      steps.push({
        array: [...array],
        left,
        right,
        level,
        isActive: true,
        isMerging: false
      });

      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);
      
      // Divide phase
      mergeSort(array, left, mid, level + 1);
      mergeSort(array, mid + 1, right, level + 1);
      
      // Conquer phase (merge)
      merge(array, left, mid, right, level);
    };

    const merge = (array: number[], left: number, mid: number, right: number, level: number) => {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      steps.push({
        array: [...array],
        left,
        right,
        level,
        isActive: true,
        isMerging: true
      });

      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j];
        j++;
        k++;
      }

      steps.push({
        array: [...array],
        left,
        right,
        level,
        isActive: true,
        isMerging: true
      });
    };

    mergeSort(workingArray, 0, arr.length - 1, 0);
    return steps;
  };

  const startVisualization = useCallback(() => {
    const newSteps = generateMergeSortSteps(originalArray);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);

    const playSteps = async () => {
      for (let i = 0; i < newSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      setIsPlaying(false);
    };

    playSteps();
  }, [originalArray, speed]);

  const stopVisualization = () => {
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep];

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Controls</label>
          <div className="flex gap-2">
            <button
              onClick={startVisualization}
              disabled={isPlaying}
              className="flex-1 px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Start Merge Sort
            </button>
            <button
              onClick={stopVisualization}
              disabled={!isPlaying}
              className="flex-1 px-4 py-2 bg-error text-inverse rounded disabled:opacity-50"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Speed</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full px-3 py-2 border border-subtle rounded text-primary bg-surface"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Progress</label>
          <div className="text-sm text-secondary">
            Step {currentStep + 1} of {steps.length || 1}
          </div>
        </div>
      </div>

      {currentStepData && (
        <div className="p-3 bg-accent-light border border-accent/20 rounded text-accent text-sm">
          {currentStepData.isMerging 
            ? `Merging subarrays at level ${currentStepData.level}`
            : `Dividing array at level ${currentStepData.level}`
          }
        </div>
      )}
    </div>
  );

  const renderArray = (array: number[], left?: number, right?: number, level?: number) => (
    <div className="flex gap-1 justify-center items-center">
      {array.map((value, index) => (
        <div
          key={index}
          className={`w-12 h-12 border-2 rounded flex items-center justify-center font-bold text-sm ${
            left !== undefined && right !== undefined && index >= left && index <= right
              ? level !== undefined && level % 2 === 0
                ? 'bg-accent-light border-accent text-accent'
                : 'bg-warning-light border-warning text-warning'
              : 'bg-surface-elevated border-subtle text-muted opacity-50'
          }`}
        >
          {value}
        </div>
      ))}
    </div>
  );

  return (
    <VisualizationLayout
      title="Divide and Conquer - Merge Sort"
      description="Divide and conquer breaks problems into smaller subproblems, solves them recursively, and combines results. Merge sort demonstrates this by dividing arrays and merging sorted subarrays."
      backLink="/algorithms"
      onReset={resetVisualization}
      controls={controls}
      complexity={{
        time: "O(n log n) - consistent across all cases",
        space: "O(n) - for temporary arrays during merging"
      }}
      operations={[
        "Divide: Split array into two halves recursively",
        "Conquer: Sort individual elements (base case)",
        "Combine: Merge sorted subarrays back together",
        "Observe the recursive tree structure"
      ]}
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Original Array */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary mb-4">Original Array</h3>
          {renderArray(originalArray)}
        </div>

        {/* Current Step Visualization */}
        {currentStepData && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-4">
              {currentStepData.isMerging ? 'Merging Phase' : 'Dividing Phase'}
            </h3>
            {renderArray(
              currentStepData.array,
              currentStepData.left,
              currentStepData.right,
              currentStepData.level
            )}
            <div className="mt-2 text-sm text-secondary">
              Level {currentStepData.level} • 
              Range: [{currentStepData.left}, {currentStepData.right}]
            </div>
          </div>
        )}

        {/* Algorithm Steps */}
        <div className="bg-surface-elevated border border-subtle rounded p-4">
          <h4 className="font-semibold text-primary mb-3">Divide and Conquer Steps:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded"></div>
              <span><strong>Divide:</strong> Split array into two halves</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span><strong>Conquer:</strong> Recursively sort subarrays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span><strong>Combine:</strong> Merge sorted subarrays</span>
            </div>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="bg-surface-elevated border border-subtle rounded p-4">
          <h4 className="font-semibold text-primary mb-3">Why O(n log n)?</h4>
          <div className="text-sm text-secondary space-y-1">
            <p>• <strong>Levels:</strong> log n levels in the recursion tree</p>
            <p>• <strong>Work per level:</strong> O(n) to merge all subarrays</p>
            <p>• <strong>Total:</strong> O(n) × O(log n) = O(n log n)</p>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default DivideAndConquerVisualizer;
