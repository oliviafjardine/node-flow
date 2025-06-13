import React, { useState, useCallback } from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

interface Interval {
  id: number;
  start: number;
  end: number;
  isSelected: boolean;
  isConflicting: boolean;
}

const Greedy1Visualizer: React.FC = () => {
  const [intervals, setIntervals] = useState<Interval[]>([
    { id: 1, start: 1, end: 4, isSelected: false, isConflicting: false },
    { id: 2, start: 3, end: 5, isSelected: false, isConflicting: false },
    { id: 3, start: 0, end: 6, isSelected: false, isConflicting: false },
    { id: 4, start: 5, end: 7, isSelected: false, isConflicting: false },
    { id: 5, start: 8, end: 9, isSelected: false, isConflicting: false },
    { id: 6, start: 5, end: 9, isSelected: false, isConflicting: false },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runGreedyAlgorithm = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setSelectedCount(0);
    
    // Reset all intervals
    setIntervals(prev => prev.map(interval => ({
      ...interval,
      isSelected: false,
      isConflicting: false
    })));

    // Sort intervals by end time (greedy choice)
    const sortedIntervals = [...intervals].sort((a, b) => a.end - b.end);
    setLastOperation("Step 1: Sort intervals by end time");
    await sleep(1500);

    let lastEndTime = -1;
    let count = 0;

    for (let i = 0; i < sortedIntervals.length; i++) {
      const current = sortedIntervals[i];
      setCurrentStep(i + 1);

      // Highlight current interval being considered
      setIntervals(prev => prev.map(interval => ({
        ...interval,
        isConflicting: interval.id === current.id
      })));

      setLastOperation(`Step ${i + 2}: Considering interval [${current.start}, ${current.end}]`);
      await sleep(1000);

      if (current.start >= lastEndTime) {
        // Select this interval
        setIntervals(prev => prev.map(interval => ({
          ...interval,
          isSelected: interval.id === current.id ? true : interval.isSelected,
          isConflicting: false
        })));
        
        lastEndTime = current.end;
        count++;
        setSelectedCount(count);
        setLastOperation(`Selected interval [${current.start}, ${current.end}]. Total: ${count}`);
      } else {
        // Reject this interval
        setIntervals(prev => prev.map(interval => ({
          ...interval,
          isConflicting: false
        })));
        setLastOperation(`Rejected interval [${current.start}, ${current.end}] - overlaps with previous`);
      }
      
      await sleep(1500);
    }

    setLastOperation(`Algorithm complete! Maximum non-overlapping intervals: ${count}`);
    setIsRunning(false);
  };

  const resetVisualization = () => {
    setIntervals([
      { id: 1, start: 1, end: 4, isSelected: false, isConflicting: false },
      { id: 2, start: 3, end: 5, isSelected: false, isConflicting: false },
      { id: 3, start: 0, end: 6, isSelected: false, isConflicting: false },
      { id: 4, start: 5, end: 7, isSelected: false, isConflicting: false },
      { id: 5, start: 8, end: 9, isSelected: false, isConflicting: false },
      { id: 6, start: 5, end: 9, isSelected: false, isConflicting: false },
    ]);
    setCurrentStep(0);
    setSelectedCount(0);
    setLastOperation(null);
    setIsRunning(false);
  };

  const addInterval = (start: number, end: number) => {
    if (start >= end) return;
    
    const newInterval: Interval = {
      id: Math.max(...intervals.map(i => i.id)) + 1,
      start,
      end,
      isSelected: false,
      isConflicting: false
    };
    
    setIntervals(prev => [...prev, newInterval]);
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Algorithm Control</label>
          <div className="flex gap-2">
            <button
              onClick={runGreedyAlgorithm}
              disabled={isRunning}
              className="flex-1 px-4 py-2 bg-accent text-inverse rounded disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Start Greedy Algorithm'}
            </button>
            <button
              onClick={resetVisualization}
              disabled={isRunning}
              className="flex-1 px-4 py-2 bg-error text-inverse rounded disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Statistics</label>
          <div className="text-sm text-secondary">
            <div>Selected Intervals: {selectedCount}</div>
            <div>Total Intervals: {intervals.length}</div>
            <div>Current Step: {currentStep}</div>
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

  const maxTime = Math.max(...intervals.map(i => i.end)) + 1;

  return (
    <VisualizationLayout
      title="Greedy I: Non-overlapping Intervals"
      description="The greedy algorithm for maximizing non-overlapping intervals sorts by end time and greedily selects intervals that don't conflict with previously selected ones."
      backLink="/algorithms"
      onReset={resetVisualization}
      controls={controls}
      complexity={{
        time: "O(n log n) - dominated by sorting",
        space: "O(1) - only constant extra space needed"
      }}
      operations={[
        "Sort intervals by end time (greedy choice)",
        "Iterate through sorted intervals",
        "Select interval if it doesn't overlap with last selected",
        "Track the end time of last selected interval"
      ]}
    >
      <div className="w-full max-w-4xl space-y-6">
        {/* Timeline visualization */}
        <div className="bg-surface border border-subtle rounded p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Interval Timeline</h3>
          
          {/* Time axis */}
          <div className="relative mb-8">
            <div className="flex justify-between text-xs text-muted mb-2">
              {Array.from({ length: maxTime + 1 }, (_, i) => (
                <span key={i}>{i}</span>
              ))}
            </div>
            <div className="h-1 bg-border rounded"></div>
          </div>

          {/* Intervals */}
          <div className="space-y-3">
            {intervals.map((interval, index) => (
              <div key={interval.id} className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm text-secondary">
                    [{interval.start}, {interval.end}]
                  </div>
                  <div className="flex-1 relative h-8">
                    <div
                      className={`absolute h-6 rounded flex items-center justify-center text-xs font-medium ${
                        interval.isSelected
                          ? 'bg-success text-inverse'
                          : interval.isConflicting
                          ? 'bg-warning text-inverse'
                          : 'bg-surface-elevated border border-subtle text-primary'
                      }`}
                      style={{
                        left: `${(interval.start / maxTime) * 100}%`,
                        width: `${((interval.end - interval.start) / maxTime) * 100}%`,
                      }}
                    >
                      {interval.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm explanation */}
        <div className="bg-surface-elevated border border-subtle rounded p-4">
          <h4 className="font-semibold text-primary mb-3">Greedy Strategy:</h4>
          <div className="space-y-2 text-sm text-secondary">
            <p>1. <strong>Sort by end time:</strong> Always consider intervals that finish earliest</p>
            <p>2. <strong>Greedy choice:</strong> Select interval if it doesn't overlap with the last selected</p>
            <p>3. <strong>Optimal substructure:</strong> Remaining problem is independent of previous choices</p>
            <p>4. <strong>Why it works:</strong> Finishing early leaves maximum room for future intervals</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded"></div>
            <span>Considering</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-surface-elevated border border-subtle rounded"></div>
            <span>Not selected</span>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default Greedy1Visualizer;
