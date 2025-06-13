import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Interval {
  id: string;
  start: number;
  end: number;
  isSelected?: boolean;
  isConflicting?: boolean;
  isConsidering?: boolean;
}

export default function Greedy1Visualizer() {
  const [intervals, setIntervals] = useState<Interval[]>([
    { id: '1', start: 1, end: 4 },
    { id: '2', start: 3, end: 5 },
    { id: '3', start: 0, end: 6 },
    { id: '4', start: 5, end: 7 },
    { id: '5', start: 8, end: 9 },
    { id: '6', start: 5, end: 9 },
    { id: '7', start: 6, end: 10 },
    { id: '8', start: 8, end: 11 },
    { id: '9', start: 11, end: 12 },
    { id: '10', start: 2, end: 13 },
    { id: '11', start: 12, end: 14 }
  ]);

  const [selectedIntervals, setSelectedIntervals] = useState<Interval[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  const resetVisualization = useCallback(() => {
    setIntervals(prev => prev.map(interval => ({
      ...interval,
      isSelected: false,
      isConflicting: false,
      isConsidering: false
    })));
    setSelectedIntervals([]);
    setCurrentStep(0);
    setLastOperation(null);
    setIsPlaying(false);
  }, []);

  const greedyIntervalScheduling = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    // Sort intervals by end time (greedy choice)
    const sortedIntervals = [...intervals].sort((a, b) => a.end - b.start);
    setLastOperation('Step 1: Sort intervals by end time (greedy choice)');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const selected: Interval[] = [];
    let step = 1;

    for (let i = 0; i < sortedIntervals.length; i++) {
      const current = sortedIntervals[i];
      step++;
      setCurrentStep(step);

      // Highlight current interval being considered
      setIntervals(prev => prev.map(interval => ({
        ...interval,
        isConsidering: interval.id === current.id,
        isSelected: selected.some(s => s.id === interval.id),
        isConflicting: false
      })));

      setLastOperation(`Step ${step}: Considering interval [${current.start}, ${current.end}]`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check for conflicts with already selected intervals
      const hasConflict = selected.some(selectedInterval =>
        current.start < selectedInterval.end && current.end > selectedInterval.start
      );

      if (hasConflict) {
        // Show conflicts
        setIntervals(prev => prev.map(interval => ({
          ...interval,
          isConflicting: selected.some(s =>
            s.id === interval.id &&
            (current.start < s.end && current.end > s.start)
          )
        })));

        setLastOperation(`Step ${step}: Interval [${current.start}, ${current.end}] conflicts with selected intervals - REJECT`);
      } else {
        // Select this interval
        selected.push(current);
        setSelectedIntervals([...selected]);

        setIntervals(prev => prev.map(interval => ({
          ...interval,
          isSelected: interval.id === current.id || selected.some(s => s.id === interval.id),
          isConsidering: false
        })));

        setLastOperation(`Step ${step}: Interval [${current.start}, ${current.end}] doesn't conflict - SELECT`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setLastOperation(`Algorithm completed! Selected ${selected.length} non-overlapping intervals.`);
    setIsPlaying(false);
  }, [intervals, isPlaying, resetVisualization]);

  const addInterval = useCallback(() => {
    const start = parseInt(newStart);
    const end = parseInt(newEnd);

    if (isNaN(start) || isNaN(end) || start >= end) return;

    const newInterval: Interval = {
      id: Date.now().toString(),
      start,
      end
    };

    setIntervals(prev => [...prev, newInterval]);
    setNewStart('');
    setNewEnd('');
    setLastOperation(`Added interval [${start}, ${end}]`);
  }, [newStart, newEnd]);

  const handleReset = () => {
    setIntervals([
      { id: '1', start: 1, end: 4 },
      { id: '2', start: 3, end: 5 },
      { id: '3', start: 0, end: 6 },
      { id: '4', start: 5, end: 7 },
      { id: '5', start: 8, end: 9 },
      { id: '6', start: 5, end: 9 },
      { id: '7', start: 6, end: 10 },
      { id: '8', start: 8, end: 11 },
      { id: '9', start: 11, end: 12 },
      { id: '10', start: 2, end: 13 },
      { id: '11', start: 12, end: 14 }
    ]);
    resetVisualization();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addInterval();
    }
  };

  const maxTime = Math.max(...intervals.map(i => i.end)) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Greedy I: Non-overlapping Intervals</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The interval scheduling problem demonstrates the greedy approach: select the interval that ends earliest,
            then repeat for remaining non-conflicting intervals. This greedy choice leads to an optimal solution.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algorithm Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Algorithm Controls</label>
              <div className="flex gap-3">
                <button
                  onClick={greedyIntervalScheduling}
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPlaying ? 'Running...' : 'Start Greedy Algorithm'}
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

            {/* Add Interval */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Add Interval</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Start"
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <input
                  type="number"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="End"
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={addInterval}
                  disabled={!newStart.trim() || !newEnd.trim() || isPlaying}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Selected Intervals</div>
              <div className="text-lg font-bold text-green-600">{selectedIntervals.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Step</div>
              <div className="text-lg font-bold text-orange-600">{currentStep}</div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-orange-700 font-semibold">Status:</span>
                <span className="text-orange-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            {/* Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Interval Timeline</h3>

              {/* Time axis */}
              <div className="relative mb-6">
                <div className="flex justify-between items-center mb-2">
                  {Array.from({ length: maxTime + 1 }, (_, i) => (
                    <div key={i} className="text-xs text-gray-500 font-mono">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="h-1 bg-gray-300 rounded"></div>
              </div>

              {/* Intervals */}
              <div className="space-y-3">
                {intervals.map((interval, index) => (
                  <motion.div
                    key={interval.id}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: interval.isConsidering ? 1.05 : 1,
                      y: interval.isConsidering ? -2 : 0
                    }}
                    className="relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">
                        [{interval.start}, {interval.end}]
                      </div>
                      <div className="flex-1 relative h-8">
                        <div
                          className={`absolute h-6 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            interval.isSelected
                              ? 'bg-green-100 border-green-400 text-green-800'
                              : interval.isConsidering
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                              : interval.isConflicting
                              ? 'bg-red-100 border-red-400 text-red-800'
                              : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                          style={{
                            left: `${(interval.start / maxTime) * 100}%`,
                            width: `${((interval.end - interval.start) / maxTime) * 100}%`
                          }}
                        >
                          {interval.id}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
                <span className="text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
                <span className="text-gray-600">Considering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
                <span className="text-gray-600">Conflicting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Available</span>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Total Intervals: <span className="font-bold text-orange-600">{intervals.length}</span>
              {selectedIntervals.length > 0 && (
                <>
                  {' | '}
                  Selected: <span className="font-bold text-green-600">{selectedIntervals.length}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Greedy algorithm • Optimal solution • Activity selection problem
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(n log n) - Dominated by sorting intervals by end time</div>
                <div><strong>Space:</strong> O(1) - Only constant extra space needed</div>
                <div><strong>Optimality:</strong> Greedy choice property ensures optimal solution</div>
                <div><strong>Strategy:</strong> Always select interval that finishes earliest</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Greedy Algorithm Steps</h3>
              <div className="text-sm text-orange-700 space-y-1 text-left">
                <div>• <strong>Sort:</strong> Order intervals by end time (greedy choice)</div>
                <div>• <strong>Iterate:</strong> Consider each interval in sorted order</div>
                <div>• <strong>Select:</strong> Choose interval if it doesn't overlap with last selected</div>
                <div>• <strong>Optimal:</strong> Finishing early leaves maximum room for future intervals</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def max_non_overlapping_intervals(intervals):
    """
    Greedy algorithm for maximum non-overlapping intervals
    Time: O(n log n), Space: O(1)
    """
    if not intervals:
        return []

    # Sort intervals by end time (greedy choice)
    sorted_intervals = sorted(intervals, key=lambda x: x[1])

    selected = []
    last_end_time = float('-inf')

    for start, end in sorted_intervals:
        # If current interval doesn't overlap with last selected
        if start >= last_end_time:
            selected.append((start, end))
            last_end_time = end

    return selected

def activity_selection(activities):
    """
    Classic activity selection problem
    Each activity has (start_time, end_time)
    """
    if not activities:
        return []

    # Sort by finish time
    activities.sort(key=lambda x: x[1])

    selected = [activities[0]]  # Always select first activity
    last_finish = activities[0][1]

    for i in range(1, len(activities)):
        start, finish = activities[i]

        # If activity starts after last selected activity finishes
        if start >= last_finish:
            selected.append((start, finish))
            last_finish = finish

    return selected

# Usage example
intervals = [(1, 4), (3, 5), (0, 6), (5, 7), (8, 9), (5, 9)]
result = max_non_overlapping_intervals(intervals)

print(f"Input intervals: {intervals}")
print(f"Selected intervals: {result}")
print(f"Maximum count: {len(result)}")

# Why greedy works:
# 1. Greedy choice: Select interval that ends earliest
# 2. Optimal substructure: Remaining problem is independent
# 3. Proof: Any optimal solution can be modified to include greedy choice
# 4. Result: Greedy algorithm produces optimal solution`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
