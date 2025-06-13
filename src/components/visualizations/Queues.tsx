import { useState } from 'react';

interface QueueItem {
  id: string;
  value: number;
  timestamp: number;
}

const generateRandomQueue = (size = 4) => {
  const queue: QueueItem[] = [];
  for (let i = 0; i < size; i++) {
    queue.push({
      id: `item-${i}`,
      value: Math.floor(Math.random() * 99) + 1,
      timestamp: Date.now() + i
    });
  }
  return queue;
};

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<QueueItem[]>(generateRandomQueue());
  const [enqueueValue, setEnqueueValue] = useState('');
  const [lastOperation, setLastOperation] = useState<'enqueue' | 'dequeue' | 'front' | 'rear' | null>(null);
  const [dequeuedValue, setDequeuedValue] = useState<number | null>(null);
  const [frontValue, setFrontValue] = useState<number | null>(null);
  const [rearValue, setRearValue] = useState<number | null>(null);

  const handleEnqueue = () => {
    const value = parseInt(enqueueValue);
    if (isNaN(value) || enqueueValue.trim() === '') return;

    const newItem: QueueItem = {
      id: `item-${Date.now()}`,
      value,
      timestamp: Date.now()
    };

    setQueue(prev => [...prev, newItem]);
    setEnqueueValue('');
    setLastOperation('enqueue');
    setDequeuedValue(null);
    setFrontValue(null);
    setRearValue(null);
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;

    const dequeuedItem = queue[0];
    setQueue(prev => prev.slice(1));
    setLastOperation('dequeue');
    setDequeuedValue(dequeuedItem.value);
    setFrontValue(null);
    setRearValue(null);
  };

  const handleFront = () => {
    if (queue.length === 0) return;
    setFrontValue(queue[0].value);
    setLastOperation('front');
    setDequeuedValue(null);
    setRearValue(null);
  };

  const handleRear = () => {
    if (queue.length === 0) return;
    setRearValue(queue[queue.length - 1].value);
    setLastOperation('rear');
    setDequeuedValue(null);
    setFrontValue(null);
  };

  const handleReset = () => {
    setQueue(generateRandomQueue());
    setEnqueueValue('');
    setLastOperation(null);
    setDequeuedValue(null);
    setFrontValue(null);
    setRearValue(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEnqueue();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Queue Visualization</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Queues follow the First-In-First-Out (FIFO) principle. Elements are added at the rear (enqueue) and 
            removed from the front (dequeue), making them ideal for task scheduling and buffering operations.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enqueue Controls */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Enqueue Element</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Value to enqueue"
                  value={enqueueValue}
                  onChange={(e) => setEnqueueValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleEnqueue}
                  disabled={!enqueueValue.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Enqueue
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Add element to the rear of the queue
              </div>
            </div>

            {/* Queue Operations */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Queue Operations</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDequeue}
                  disabled={queue.length === 0}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Dequeue
                </button>
                <button
                  onClick={handleFront}
                  disabled={queue.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Front
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRear}
                  disabled={queue.length === 0}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Rear
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Remove from front, view front/rear values
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation === 'enqueue' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-semibold">✓ Enqueued:</span>
                <span className="text-green-600 ml-2">Added element to rear of queue</span>
              </div>
            )}

            {lastOperation === 'dequeue' && dequeuedValue !== null && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-700 font-semibold">✓ Dequeued:</span>
                <span className="text-red-600 ml-2">Removed {dequeuedValue} from front of queue</span>
              </div>
            )}

            {lastOperation === 'front' && frontValue !== null && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">✓ Front:</span>
                <span className="text-blue-600 ml-2">Front element is {frontValue}</span>
              </div>
            )}

            {lastOperation === 'rear' && rearValue !== null && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-purple-700 font-semibold">✓ Rear:</span>
                <span className="text-purple-600 ml-2">Rear element is {rearValue}</span>
              </div>
            )}

            {queue.length === 0 && lastOperation && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-700 font-semibold">⚠ Empty Queue:</span>
                <span className="text-yellow-600 ml-2">No elements in queue</span>
              </div>
            )}
          </div>
        </div>

        {/* Queue Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center min-h-[300px] p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            {/* Labels */}
            <div className="flex justify-between w-full max-w-4xl mb-4">
              <div className="text-red-600 font-semibold">FRONT (Dequeue)</div>
              <div className="text-green-600 font-semibold">REAR (Enqueue)</div>
            </div>

            {/* Queue Container */}
            <div className="relative flex items-center justify-center">
              {/* Direction Arrows */}
              {queue.length > 0 && (
                <>
                  <div className="absolute -left-24 flex flex-col items-center text-red-500">
                    <div className="text-sm font-medium mb-1">Dequeue</div>
                    <div className="text-2xl">←</div>
                  </div>
                  <div className="absolute -right-24 flex flex-col items-center text-green-500">
                    <div className="text-sm font-medium mb-1">Enqueue</div>
                    <div className="text-2xl">→</div>
                  </div>
                </>
              )}

              {/* Queue Elements */}
              <div className="flex gap-2 min-w-[400px] min-h-[80px] items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                {queue.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <div className="text-2xl font-bold mb-2">Empty Queue</div>
                    <div className="text-lg">Enqueue elements to get started</div>
                  </div>
                ) : (
                  queue.map((item, index) => (
                    <div
                      key={item.id}
                      className={`
                        w-20 h-20 border-3 rounded-xl flex flex-col items-center justify-center
                        transition-all duration-300 relative font-bold text-lg
                        ${index === 0
                          ? 'bg-red-100 border-red-400 text-red-800 shadow-lg' // Front element
                          : index === queue.length - 1
                          ? 'bg-green-100 border-green-400 text-green-800 shadow-lg' // Rear element
                          : 'bg-white border-gray-300 text-gray-700 shadow-md'
                        }
                      `}
                    >
                      <span className="text-lg">{item.value}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {index === 0 ? 'F' : index === queue.length - 1 ? 'R' : index}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Queue Direction Indicator */}
            {queue.length > 0 && (
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                  <span>Front Element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span>Rear Element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Queue Element</span>
                </div>
              </div>
            )}
          </div>

          {/* Queue Info */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center gap-8 text-lg">
              <div className="text-gray-700">
                Size: <span className="font-bold text-blue-600">{queue.length}</span>
              </div>
              <div className="text-gray-700">
                Front: <span className="font-bold text-red-600">{queue.length > 0 ? queue[0].value : 'Empty'}</span>
              </div>
              <div className="text-gray-700">
                Rear: <span className="font-bold text-green-600">{queue.length > 0 ? queue[queue.length - 1].value : 'Empty'}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 max-w-2xl mx-auto">
              FIFO Structure • First-In-First-Out • O(1) enqueue/dequeue operations
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Enqueue:</strong> O(1) - Add element to rear</div>
                <div><strong>Dequeue:</strong> O(1) - Remove element from front</div>
                <div><strong>Front/Rear:</strong> O(1) - Access front/rear elements</div>
                <div><strong>Space:</strong> O(n) - Linear space for n elements</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Queue Operations</h3>
              <div className="text-sm text-blue-700 space-y-1 text-left">
                <div>• <strong>Enqueue:</strong> Add elements to the rear of the queue</div>
                <div>• <strong>Dequeue:</strong> Remove and return the front element</div>
                <div>• <strong>Front:</strong> View the front element without removing it</div>
                <div>• <strong>Rear:</strong> View the rear element without removing it</div>
                <div>• <strong>FIFO Principle:</strong> First element added is the first to be removed</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-green-700 font-mono bg-green-100 p-3 rounded overflow-x-auto">
{`from collections import deque

# Queue implementation using deque for O(1) operations
class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        """Add item to rear of queue - O(1)"""
        self.items.append(item)
        print(f"Enqueued: {item}")

    def dequeue(self):
        """Remove and return front item - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        item = self.items.popleft()
        print(f"Dequeued: {item}")
        return item

    def front(self):
        """Return front item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]

    def rear(self):
        """Return rear item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

# Usage example
queue = Queue()
queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(30)

print(f"Front: {queue.front()}")  # Output: 10
print(f"Rear: {queue.rear()}")    # Output: 30
print(f"Size: {queue.size()}")    # Output: 3

first_out = queue.dequeue()       # Output: 10 (FIFO)
print(f"Queue after dequeue: {list(queue.items)}")  # [20, 30]`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}