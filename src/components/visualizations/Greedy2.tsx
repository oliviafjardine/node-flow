import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Item {
  id: string;
  weight: number;
  value: number;
  ratio: number;
  isSelected?: boolean;
  isConsidering?: boolean;
  fractionTaken?: number;
}

export default function Greedy2Visualizer() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', weight: 10, value: 60, ratio: 6.0 },
    { id: '2', weight: 20, value: 100, ratio: 5.0 },
    { id: '3', weight: 30, value: 120, ratio: 4.0 },
    { id: '4', weight: 15, value: 45, ratio: 3.0 },
    { id: '5', weight: 25, value: 50, ratio: 2.0 },
    { id: '6', weight: 40, value: 40, ratio: 1.0 }
  ]);

  const [knapsackCapacity, setKnapsackCapacity] = useState(50);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState('');
  const [newValue, setNewValue] = useState('');

  const resetVisualization = useCallback(() => {
    setItems(prev => prev.map(item => ({
      ...item,
      isSelected: false,
      isConsidering: false,
      fractionTaken: 0
    })));
    setCurrentWeight(0);
    setCurrentValue(0);
    setCurrentStep(0);
    setLastOperation(null);
    setIsPlaying(false);
  }, []);

  const greedyFractionalKnapsack = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    // Sort items by value-to-weight ratio (greedy choice)
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    setLastOperation('Step 1: Sort items by value-to-weight ratio (descending)');

    await new Promise(resolve => setTimeout(resolve, 2000));

    let remainingCapacity = knapsackCapacity;
    let totalValue = 0;
    let step = 1;

    for (let i = 0; i < sortedItems.length; i++) {
      const current = sortedItems[i];
      step++;
      setCurrentStep(step);

      if (remainingCapacity <= 0) break;

      // Highlight current item being considered
      setItems(prev => prev.map(item => ({
        ...item,
        isConsidering: item.id === current.id
      })));

      setLastOperation(`Step ${step}: Considering item ${current.id} (ratio: ${current.ratio.toFixed(1)})`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (current.weight <= remainingCapacity) {
        // Take the entire item
        const fraction = 1.0;
        totalValue += current.value;
        remainingCapacity -= current.weight;

        setItems(prev => prev.map(item => ({
          ...item,
          isSelected: item.id === current.id,
          isConsidering: false,
          fractionTaken: item.id === current.id ? fraction : item.fractionTaken
        })));

        setCurrentWeight(knapsackCapacity - remainingCapacity);
        setCurrentValue(totalValue);
        setLastOperation(`Step ${step}: Take entire item ${current.id} (weight: ${current.weight}, value: ${current.value})`);
      } else if (remainingCapacity > 0) {
        // Take fraction of the item
        const fraction = remainingCapacity / current.weight;
        const fractionalValue = fraction * current.value;
        totalValue += fractionalValue;

        setItems(prev => prev.map(item => ({
          ...item,
          isSelected: item.id === current.id,
          isConsidering: false,
          fractionTaken: item.id === current.id ? fraction : item.fractionTaken
        })));

        setCurrentWeight(knapsackCapacity);
        setCurrentValue(totalValue);
        setLastOperation(`Step ${step}: Take ${(fraction * 100).toFixed(1)}% of item ${current.id} (value: ${fractionalValue.toFixed(1)})`);
        remainingCapacity = 0;
      } else {
        setItems(prev => prev.map(item => ({
          ...item,
          isConsidering: false
        })));
        setLastOperation(`Step ${step}: Skip item ${current.id} - no remaining capacity`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setLastOperation(`Algorithm completed! Total value: ${totalValue.toFixed(1)}, Weight used: ${(knapsackCapacity - remainingCapacity).toFixed(1)}/${knapsackCapacity}`);
    setIsPlaying(false);
  }, [items, knapsackCapacity, isPlaying, resetVisualization]);

  const addItem = useCallback(() => {
    const weight = parseFloat(newWeight);
    const value = parseFloat(newValue);

    if (isNaN(weight) || isNaN(value) || weight <= 0 || value <= 0) return;

    const ratio = value / weight;
    const newItem: Item = {
      id: Date.now().toString(),
      weight,
      value,
      ratio
    };

    setItems(prev => [...prev, newItem]);
    setNewWeight('');
    setNewValue('');
    setLastOperation(`Added item with weight ${weight}, value ${value}, ratio ${ratio.toFixed(2)}`);
  }, [newWeight, newValue]);

  const handleReset = () => {
    setItems([
      { id: '1', weight: 10, value: 60, ratio: 6.0 },
      { id: '2', weight: 20, value: 100, ratio: 5.0 },
      { id: '3', weight: 30, value: 120, ratio: 4.0 },
      { id: '4', weight: 15, value: 45, ratio: 3.0 },
      { id: '5', weight: 25, value: 50, ratio: 2.0 },
      { id: '6', weight: 40, value: 40, ratio: 1.0 }
    ]);
    setKnapsackCapacity(50);
    resetVisualization();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Greedy II: Fractional Knapsack</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The fractional knapsack problem allows taking fractions of items. The greedy approach sorts items
            by value-to-weight ratio and takes items in order until the knapsack is full.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Algorithm Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Algorithm Controls</label>
              <div className="flex gap-3">
                <button
                  onClick={greedyFractionalKnapsack}
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPlaying ? 'Running...' : 'Start Algorithm'}
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

            {/* Knapsack Capacity */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Knapsack Capacity</label>
              <input
                type="number"
                value={knapsackCapacity}
                onChange={(e) => setKnapsackCapacity(parseInt(e.target.value) || 50)}
                disabled={isPlaying}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
              />
            </div>

            {/* Add Item */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Add Item</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Weight"
                  disabled={isPlaying}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Value"
                  disabled={isPlaying}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={addItem}
                  disabled={!newWeight.trim() || !newValue.trim() || isPlaying}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Weight</div>
              <div className="text-lg font-bold text-purple-600">{currentWeight.toFixed(1)} / {knapsackCapacity}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Value</div>
              <div className="text-lg font-bold text-green-600">{currentValue.toFixed(1)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Step</div>
              <div className="text-lg font-bold text-blue-600">{currentStep}</div>
            </div>
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
            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Items (Sorted by Value/Weight Ratio)</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-4 text-gray-700">Item</th>
                      <th className="text-left py-2 px-4 text-gray-700">Weight</th>
                      <th className="text-left py-2 px-4 text-gray-700">Value</th>
                      <th className="text-left py-2 px-4 text-gray-700">Ratio</th>
                      <th className="text-left py-2 px-4 text-gray-700">Fraction</th>
                      <th className="text-left py-2 px-4 text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...items].sort((a, b) => b.ratio - a.ratio).map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ scale: 1 }}
                        animate={{
                          scale: item.isConsidering ? 1.02 : 1,
                          backgroundColor: item.isConsidering ? '#fef3c7' : 'transparent'
                        }}
                        className={`border-b border-gray-200 transition-all duration-300 ${
                          item.isSelected ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-gray-800">{item.id}</td>
                        <td className="py-3 px-4 text-gray-600">{item.weight}</td>
                        <td className="py-3 px-4 text-gray-600">{item.value}</td>
                        <td className="py-3 px-4 text-blue-600 font-semibold">{item.ratio.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          {item.fractionTaken ? (
                            <span className="text-green-600 font-semibold">
                              {(item.fractionTaken * 100).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">0%</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.isSelected
                              ? 'bg-green-100 text-green-800'
                              : item.isConsidering
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.isSelected ? 'Selected' : item.isConsidering ? 'Considering' : 'Available'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Knapsack Visualization */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Knapsack Status</h3>
              <div className="relative">
                <div className="w-full h-12 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 flex items-center justify-center text-white font-bold"
                    style={{ width: `${(currentWeight / knapsackCapacity) * 100}%` }}
                  >
                    {currentWeight > 0 && `${currentWeight.toFixed(1)} / ${knapsackCapacity}`}
                  </div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  Capacity: {((currentWeight / knapsackCapacity) * 100).toFixed(1)}% used
                </div>
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Total Items: <span className="font-bold text-purple-600">{items.length}</span>
              {currentValue > 0 && (
                <>
                  {' | '}
                  Efficiency: <span className="font-bold text-green-600">{(currentValue / currentWeight).toFixed(2)}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Fractional knapsack • Greedy algorithm • Optimal solution guaranteed
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(n log n) - Dominated by sorting items by value/weight ratio</div>
                <div><strong>Space:</strong> O(1) - Only constant extra space needed</div>
                <div><strong>Optimality:</strong> Greedy choice always leads to optimal solution</div>
                <div><strong>Key Insight:</strong> Taking highest ratio items first maximizes value</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Fractional Knapsack Algorithm</h3>
              <div className="text-sm text-purple-700 space-y-1 text-left">
                <div>• <strong>Calculate:</strong> Value-to-weight ratio for each item</div>
                <div>• <strong>Sort:</strong> Items by ratio in descending order</div>
                <div>• <strong>Select:</strong> Items greedily until capacity is reached</div>
                <div>• <strong>Fraction:</strong> Take partial item if needed to fill remaining capacity</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def fractional_knapsack(items, capacity):
    """
    Fractional knapsack using greedy algorithm
    Time: O(n log n), Space: O(1)

    Args:
        items: List of (weight, value) tuples
        capacity: Maximum weight capacity

    Returns:
        (max_value, selected_items)
    """
    # Calculate value-to-weight ratio for each item
    item_ratios = []
    for i, (weight, value) in enumerate(items):
        ratio = value / weight if weight > 0 else 0
        item_ratios.append((ratio, weight, value, i))

    # Sort by ratio in descending order (greedy choice)
    item_ratios.sort(reverse=True)

    total_value = 0
    remaining_capacity = capacity
    selected_items = []

    for ratio, weight, value, original_index in item_ratios:
        if remaining_capacity <= 0:
            break

        if weight <= remaining_capacity:
            # Take entire item
            total_value += value
            remaining_capacity -= weight
            selected_items.append((original_index, 1.0, value))
        else:
            # Take fraction of item
            fraction = remaining_capacity / weight
            fractional_value = fraction * value
            total_value += fractional_value
            selected_items.append((original_index, fraction, fractional_value))
            remaining_capacity = 0

    return total_value, selected_items

class Item:
    def __init__(self, weight, value, name=""):
        self.weight = weight
        self.value = value
        self.name = name
        self.ratio = value / weight if weight > 0 else 0

    def __repr__(self):
        return f"Item({self.name}, w={self.weight}, v={self.value}, r={self.ratio:.2f})"

def solve_fractional_knapsack_oop(items, capacity):
    """Object-oriented approach"""
    # Sort items by value-to-weight ratio (descending)
    sorted_items = sorted(items, key=lambda x: x.ratio, reverse=True)

    total_value = 0
    remaining_capacity = capacity
    solution = []

    for item in sorted_items:
        if remaining_capacity <= 0:
            break

        if item.weight <= remaining_capacity:
            # Take entire item
            total_value += item.value
            remaining_capacity -= item.weight
            solution.append((item, 1.0))
        else:
            # Take fraction
            fraction = remaining_capacity / item.weight
            total_value += fraction * item.value
            solution.append((item, fraction))
            remaining_capacity = 0

    return total_value, solution

# Usage example
items = [(10, 60), (20, 100), (30, 120)]
capacity = 50

max_value, selection = fractional_knapsack(items, capacity)
print(f"Maximum value: {max_value}")
print(f"Selection: {selection}")

# OOP example
item_objects = [
    Item(10, 60, "A"),
    Item(20, 100, "B"),
    Item(30, 120, "C")
]

max_val, sol = solve_fractional_knapsack_oop(item_objects, capacity)
print(f"\\nOOP approach - Max value: {max_val}")
for item, fraction in sol:
    print(f"Take {fraction*100:.1f}% of {item}")`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
