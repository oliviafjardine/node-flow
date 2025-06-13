import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface HeapNode {
  value: number;
  index: number;
  x: number;
  y: number;
  isHighlighted: boolean;
}

const HeapsVisualizer: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([50, 30, 40, 20, 25, 35, 30]);
  const [inputValue, setInputValue] = useState('');
  const [isMaxHeap, setIsMaxHeap] = useState(true);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

  const getParentIndex = (i: number) => Math.floor((i - 1) / 2);
  const getLeftChildIndex = (i: number) => 2 * i + 1;
  const getRightChildIndex = (i: number) => 2 * i + 2;

  const calculatePosition = (index: number, level: number): { x: number; y: number } => {
    const levelWidth = Math.pow(2, level);
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const spacing = 400 / (levelWidth + 1);
    
    return {
      x: spacing * (positionInLevel + 1),
      y: 60 + level * 80
    };
  };

  const getHeapNodes = (): HeapNode[] => {
    return heap.map((value, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const position = calculatePosition(index, level);
      
      return {
        value,
        index,
        x: position.x,
        y: position.y,
        isHighlighted: highlightedIndices.includes(index)
      };
    });
  };

  const heapifyUp = (arr: number[], index: number): number[] => {
    const newArr = [...arr];
    let currentIndex = index;
    
    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      const shouldSwap = isMaxHeap 
        ? newArr[currentIndex] > newArr[parentIndex]
        : newArr[currentIndex] < newArr[parentIndex];
      
      if (shouldSwap) {
        [newArr[currentIndex], newArr[parentIndex]] = [newArr[parentIndex], newArr[currentIndex]];
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
    
    return newArr;
  };

  const heapifyDown = (arr: number[], index: number): number[] => {
    const newArr = [...arr];
    let currentIndex = index;
    
    while (true) {
      const leftChild = getLeftChildIndex(currentIndex);
      const rightChild = getRightChildIndex(currentIndex);
      let targetIndex = currentIndex;
      
      if (leftChild < newArr.length) {
        const shouldSwapLeft = isMaxHeap
          ? newArr[leftChild] > newArr[targetIndex]
          : newArr[leftChild] < newArr[targetIndex];
        if (shouldSwapLeft) targetIndex = leftChild;
      }
      
      if (rightChild < newArr.length) {
        const shouldSwapRight = isMaxHeap
          ? newArr[rightChild] > newArr[targetIndex]
          : newArr[rightChild] < newArr[targetIndex];
        if (shouldSwapRight) targetIndex = rightChild;
      }
      
      if (targetIndex !== currentIndex) {
        [newArr[currentIndex], newArr[targetIndex]] = [newArr[targetIndex], newArr[currentIndex]];
        currentIndex = targetIndex;
      } else {
        break;
      }
    }
    
    return newArr;
  };

  const handleInsert = useCallback(() => {
    if (!inputValue.trim()) return;

    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newHeap = [...heap, value];
    const heapified = heapifyUp(newHeap, newHeap.length - 1);
    
    setHeap(heapified);
    setInputValue('');
    setLastOperation(`Inserted ${value} into ${isMaxHeap ? 'max' : 'min'} heap`);
    
    // Highlight the path of insertion
    setHighlightedIndices([heapified.length - 1]);
    setTimeout(() => setHighlightedIndices([]), 2000);
  }, [inputValue, heap, isMaxHeap]);

  const handleExtractRoot = useCallback(() => {
    if (heap.length === 0) return;

    const root = heap[0];
    const newHeap = [...heap];
    
    // Move last element to root and remove last element
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    
    // Heapify down from root
    const heapified = heapifyDown(newHeap, 0);
    
    setHeap(heapified);
    setLastOperation(`Extracted ${isMaxHeap ? 'maximum' : 'minimum'} value: ${root}`);
    
    // Highlight root
    setHighlightedIndices([0]);
    setTimeout(() => setHighlightedIndices([]), 2000);
  }, [heap, isMaxHeap]);

  const handleToggleHeapType = () => {
    setIsMaxHeap(!isMaxHeap);
    // Rebuild heap with new property
    const newHeap = [...heap];
    for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
      const heapified = heapifyDown(newHeap, i);
      newHeap.splice(0, newHeap.length, ...heapified);
    }
    setHeap(newHeap);
    setLastOperation(`Converted to ${!isMaxHeap ? 'max' : 'min'} heap`);
  };

  const handleReset = () => {
    setHeap([50, 30, 40, 20, 25, 35, 30]);
    setInputValue('');
    setIsMaxHeap(true);
    setLastOperation(null);
    setHighlightedIndices([]);
  };

  const heapNodes = getHeapNodes();

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Insert Value</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 px-3 py-2 border border-subtle rounded text-primary bg-surface"
            />
            <button
              onClick={handleInsert}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              Insert
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Extract Root</label>
          <button
            onClick={handleExtractRoot}
            disabled={heap.length === 0}
            className="w-full px-4 py-2 bg-error text-inverse rounded disabled:opacity-50"
          >
            Extract {isMaxHeap ? 'Max' : 'Min'}
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Heap Type</label>
          <button
            onClick={handleToggleHeapType}
            className="w-full px-4 py-2 bg-warning text-inverse rounded"
          >
            Switch to {isMaxHeap ? 'Min' : 'Max'} Heap
          </button>
        </div>
      </div>

      {lastOperation && (
        <div className="p-3 bg-accent-light border border-accent/20 rounded text-accent text-sm">
          {lastOperation}
        </div>
      )}

      <div className="text-sm text-secondary">
        Current heap type: <strong>{isMaxHeap ? 'Max Heap' : 'Min Heap'}</strong>
        {heap.length > 0 && (
          <span> • Root value: <strong>{heap[0]}</strong></span>
        )}
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Heap Visualization"
      description="Heaps are complete binary trees that satisfy the heap property. Max heaps have parent nodes greater than children, while min heaps have parent nodes smaller than children."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Insert: O(log n), Extract: O(log n), Peek: O(1)",
        space: "O(n)"
      }}
      operations={[
        "Insert values and watch them bubble up",
        "Extract root (max/min) and see heapify down",
        "Switch between max heap and min heap",
        "Observe the complete binary tree structure"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="relative bg-surface border border-subtle rounded" style={{ height: '400px' }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render edges */}
            {heapNodes.map((node) => {
              const leftChildIndex = getLeftChildIndex(node.index);
              const rightChildIndex = getRightChildIndex(node.index);
              
              return (
                <g key={`edges-${node.index}`}>
                  {leftChildIndex < heap.length && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={heapNodes[leftChildIndex].x}
                      y2={heapNodes[leftChildIndex].y}
                      stroke="hsl(var(--color-border))"
                      strokeWidth="2"
                    />
                  )}
                  {rightChildIndex < heap.length && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={heapNodes[rightChildIndex].x}
                      y2={heapNodes[rightChildIndex].y}
                      stroke="hsl(var(--color-border))"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render nodes */}
          {heapNodes.map((node) => (
            <div
              key={node.index}
              className={`absolute w-12 h-12 border-2 rounded-full flex items-center justify-center font-bold ${
                node.isHighlighted
                  ? 'bg-accent-light border-accent text-accent'
                  : node.index === 0
                  ? 'bg-warning-light border-warning text-warning'
                  : 'bg-surface-elevated border-subtle text-primary'
              }`}
              style={{
                left: node.x - 24,
                top: node.y - 24,
              }}
            >
              {node.value}
            </div>
          ))}

          {/* Array representation */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-sm text-secondary mb-2">Array representation:</div>
            <div className="flex gap-1 flex-wrap">
              {heap.map((value, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 border rounded flex items-center justify-center text-xs ${
                    highlightedIndices.includes(index)
                      ? 'bg-accent-light border-accent text-accent'
                      : 'bg-surface-elevated border-subtle text-primary'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default HeapsVisualizer;
