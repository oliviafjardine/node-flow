import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Item {
  id: string;
  weight: number;
  value: number;
  isSelected?: boolean;
  isConsidering?: boolean;
}

interface DPCell {
  value: number;
  isActive?: boolean;
  isComputed?: boolean;
  choice?: 'include' | 'exclude';
}

export default function DP1Visualizer() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', weight: 1, value: 1 },
    { id: '2', weight: 3, value: 4 },
    { id: '3', weight: 4, value: 5 },
    { id: '4', weight: 5, value: 7 }
  ]);

  const [knapsackCapacity, setKnapsackCapacity] = useState(7);
  const [dpTable, setDpTable] = useState<DPCell[][]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentItem, setCurrentItem] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [finalValue, setFinalValue] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const resetVisualization = useCallback(() => {
    const rows = items.length + 1;
    const cols = knapsackCapacity + 1;
    const newTable: DPCell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({ value: 0 }))
    );

    setDpTable(newTable);

    setCurrentItem(0);
    setCurrentWeight(0);
    setLastOperation(null);
    setFinalValue(0);
    setSelectedItems([]);
    setIsPlaying(false);

    setItems(prev => prev.map(item => ({
      ...item,
      isSelected: false,
      isConsidering: false
    })));
  }, [items.length, knapsackCapacity]);

  const knapsackDP = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    const n = items.length;
    const W = knapsackCapacity;
    const dp: DPCell[][] = Array(n + 1).fill(null).map(() =>
      Array(W + 1).fill(null).map(() => ({ value: 0 }))
    );

    setLastOperation('Initializing DP table with base cases (0 items or 0 capacity = 0 value)');
    setDpTable([...dp]);
    await new Promise(resolve => setTimeout(resolve, 2000));

    let step = 0;

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];

      setItems(prev => prev.map(it => ({
        ...it,
        isConsidering: it.id === item.id
      })));

      setCurrentItem(i);
      setLastOperation(`Processing item ${item.id} (weight: ${item.weight}, value: ${item.value})`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      for (let w = 1; w <= W; w++) {
        step++;
        setCurrentWeight(w);

        // Highlight current cell
        dp[i][w].isActive = true;
        setDpTable([...dp]);

        if (item.weight <= w) {
          // Can include this item
          const includeValue = item.value + dp[i - 1][w - item.weight].value;
          const excludeValue = dp[i - 1][w].value;

          setLastOperation(`Item ${item.id}, capacity ${w}: Include (${includeValue}) vs Exclude (${excludeValue})`);
          await new Promise(resolve => setTimeout(resolve, 1000));

          if (includeValue > excludeValue) {
            dp[i][w].value = includeValue;
            dp[i][w].choice = 'include';
            setLastOperation(`Choose to INCLUDE item ${item.id} for capacity ${w}`);
          } else {
            dp[i][w].value = excludeValue;
            dp[i][w].choice = 'exclude';
            setLastOperation(`Choose to EXCLUDE item ${item.id} for capacity ${w}`);
          }
        } else {
          // Cannot include this item
          dp[i][w].value = dp[i - 1][w].value;
          dp[i][w].choice = 'exclude';
          setLastOperation(`Item ${item.id} too heavy for capacity ${w}, exclude`);
        }

        dp[i][w].isComputed = true;
        dp[i][w].isActive = false;
        setDpTable([...dp]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setFinalValue(dp[n][W].value);
    setLastOperation(`DP table completed! Maximum value: ${dp[n][W].value}`);

    // Backtrack to find selected items
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastOperation('Backtracking to find selected items...');

    const selected: Item[] = [];
    let i = n, w = W;

    while (i > 0 && w > 0) {
      if (dp[i][w].choice === 'include') {
        selected.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
      i--;
    }

    setSelectedItems(selected);
    setItems(prev => prev.map(item => ({
      ...item,
      isSelected: selected.some(s => s.id === item.id),
      isConsidering: false
    })));

    setLastOperation(`Backtracking complete! Selected items: ${selected.map(s => s.id).join(', ')}`);
    setIsPlaying(false);
  }, [items, knapsackCapacity, isPlaying, resetVisualization]);

  const handleReset = () => {
    setItems([
      { id: '1', weight: 1, value: 1 },
      { id: '2', weight: 3, value: 4 },
      { id: '3', weight: 4, value: 5 },
      { id: '4', weight: 5, value: 7 }
    ]);
    setKnapsackCapacity(7);
    resetVisualization();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">DP I: 0-1 Knapsack Problem</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The 0-1 knapsack problem uses dynamic programming to find the optimal subset of items that maximizes
            value while staying within weight constraints. Each item can be taken at most once.
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
                  onClick={knapsackDP}
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPlaying ? 'Running DP...' : 'Start DP Algorithm'}
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

            {/* Capacity Control */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Knapsack Capacity</label>
              <input
                type="number"
                value={knapsackCapacity}
                onChange={(e) => setKnapsackCapacity(parseInt(e.target.value) || 7)}
                disabled={isPlaying}
                min="1"
                max="15"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Item</div>
              <div className="text-lg font-bold text-blue-600">{currentItem} / {items.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Weight</div>
              <div className="text-lg font-bold text-purple-600">{currentWeight} / {knapsackCapacity}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Max Value</div>
              <div className="text-lg font-bold text-green-600">{finalValue}</div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">Status:</span>
                <span className="text-blue-600 ml-2">{lastOperation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            {/* Items Display */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Items</h3>
              <div className="flex justify-center gap-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: item.isConsidering ? 1.1 : 1,
                      y: item.isConsidering ? -5 : 0
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                      item.isSelected
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : item.isConsidering
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-lg">Item {item.id}</div>
                    <div className="text-sm">Weight: {item.weight}</div>
                    <div className="text-sm">Value: {item.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* DP Table */}
            {dpTable.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">DP Table</h3>
                <div className="overflow-x-auto">
                  <table className="mx-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 bg-gray-100">Items \\ Weight</th>
                        {Array.from({ length: knapsackCapacity + 1 }, (_, w) => (
                          <th key={w} className="border border-gray-300 px-3 py-2 bg-gray-100 min-w-[50px]">
                            {w}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpTable.map((row, i) => (
                        <tr key={i}>
                          <td className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold">
                            {i === 0 ? '∅' : `Item ${items[i - 1]?.id}`}
                          </td>
                          {row.map((cell, w) => (
                            <td
                              key={w}
                              className={`border border-gray-300 px-3 py-2 text-center transition-all duration-300 ${
                                cell.isActive
                                  ? 'bg-yellow-200 border-yellow-400'
                                  : cell.isComputed
                                  ? cell.choice === 'include'
                                    ? 'bg-green-100'
                                    : 'bg-blue-100'
                                  : 'bg-white'
                              }`}
                            >
                              {cell.value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 border border-yellow-400"></div>
                    <span>Computing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-gray-300"></div>
                    <span>Include Item</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
                    <span>Exclude Item</span>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Selected Items</h3>
                <div className="text-green-600 font-semibold">
                  {selectedItems.map(item => `Item ${item.id}`).join(', ')}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Total Weight: {selectedItems.reduce((sum, item) => sum + item.weight, 0)} / {knapsackCapacity}
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Items: <span className="font-bold text-blue-600">{items.length}</span>
              {' | '}
              Capacity: <span className="font-bold text-purple-600">{knapsackCapacity}</span>
              {finalValue > 0 && (
                <>
                  {' | '}
                  Optimal Value: <span className="font-bold text-green-600">{finalValue}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Dynamic programming • 0-1 knapsack • Optimal substructure • Overlapping subproblems
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(n × W) - Fill DP table of size n × W</div>
                <div><strong>Space:</strong> O(n × W) - Store DP table (can be optimized to O(W))</div>
                <div><strong>Recurrence:</strong> dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])</div>
                <div><strong>Base Case:</strong> dp[0][w] = 0 for all w (no items = 0 value)</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Dynamic Programming Approach</h3>
              <div className="text-sm text-blue-700 space-y-1 text-left">
                <div>• <strong>State:</strong> dp[i][w] = max value using first i items with capacity w</div>
                <div>• <strong>Choice:</strong> For each item, decide to include or exclude</div>
                <div>• <strong>Transition:</strong> Take maximum of including vs excluding current item</div>
                <div>• <strong>Backtrack:</strong> Trace optimal choices to find selected items</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def knapsack_01(weights, values, capacity):
    """
    0-1 Knapsack using Dynamic Programming
    Time: O(n*W), Space: O(n*W)

    Args:
        weights: List of item weights
        values: List of item values
        capacity: Maximum weight capacity

    Returns:
        (max_value, selected_items)
    """
    n = len(weights)

    # Create DP table: dp[i][w] = max value with i items and capacity w
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]

    # Fill the DP table
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            # Option 1: Don't include current item
            exclude = dp[i-1][w]

            # Option 2: Include current item (if it fits)
            include = 0
            if weights[i-1] <= w:
                include = values[i-1] + dp[i-1][w - weights[i-1]]

            # Take the maximum
            dp[i][w] = max(exclude, include)

    # Backtrack to find selected items
    selected_items = []
    i, w = n, capacity

    while i > 0 and w > 0:
        # If value came from including current item
        if dp[i][w] != dp[i-1][w]:
            selected_items.append(i-1)  # Add item index
            w -= weights[i-1]  # Reduce remaining capacity
        i -= 1

    return dp[n][capacity], selected_items[::-1]

def knapsack_01_optimized(weights, values, capacity):
    """
    Space-optimized version using only O(W) space
    """
    n = len(weights)

    # Use only two rows instead of full table
    prev = [0] * (capacity + 1)
    curr = [0] * (capacity + 1)

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            # Don't include current item
            curr[w] = prev[w]

            # Include current item if it fits
            if weights[i-1] <= w:
                include_value = values[i-1] + prev[w - weights[i-1]]
                curr[w] = max(curr[w], include_value)

        # Swap rows for next iteration
        prev, curr = curr, prev

    return prev[capacity]

# Usage example
weights = [1, 3, 4, 5]
values = [1, 4, 5, 7]
capacity = 7

max_value, selected = knapsack_01(weights, values, capacity)
print(f"Maximum value: {max_value}")
print(f"Selected items (0-indexed): {selected}")

# Print selected items details
total_weight = 0
total_value = 0
for idx in selected:
    print(f"Item {idx}: weight={weights[idx]}, value={values[idx]}")
    total_weight += weights[idx]
    total_value += values[idx]

print(f"Total weight: {total_weight}/{capacity}")
print(f"Total value: {total_value}")

# Space-optimized version
max_val_opt = knapsack_01_optimized(weights, values, capacity)
print(f"Optimized result: {max_val_opt}")`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
