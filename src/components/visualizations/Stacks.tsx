import { useState } from 'react';

interface StackItem {
  id: string;
  value: number;
  timestamp: number;
}

const generateRandomStack = (size = 4) => {
  const stack: StackItem[] = [];
  for (let i = 0; i < size; i++) {
    stack.push({
      id: `item-${i}`,
      value: Math.floor(Math.random() * 99) + 1,
      timestamp: Date.now() + i
    });
  }
  return stack;
};

export default function StackVisualizer() {
  const [stack, setStack] = useState<StackItem[]>(generateRandomStack());
  const [pushValue, setPushValue] = useState('');
  const [lastOperation, setLastOperation] = useState<'push' | 'pop' | null>(null);
  const [poppedValue, setPoppedValue] = useState<number | null>(null);

  const handlePush = () => {
    const value = parseInt(pushValue);
    if (isNaN(value) || pushValue.trim() === '') return;

    const newItem: StackItem = {
      id: `item-${Date.now()}`,
      value,
      timestamp: Date.now()
    };

    setStack(prev => [...prev, newItem]);
    setPushValue('');
    setLastOperation('push');
    setPoppedValue(null);
  };

  const handlePop = () => {
    if (stack.length === 0) return;

    const poppedItem = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    setLastOperation('pop');
    setPoppedValue(poppedItem.value);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      alert('Stack is empty - nothing to peek at!');
      return;
    }
    alert(`Top element: ${stack[stack.length - 1].value}`);
  };

  const handleReset = () => {
    setStack(generateRandomStack());
    setPushValue('');
    setLastOperation(null);
    setPoppedValue(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePush();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Stack Visualization</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stacks follow the Last-In-First-Out (LIFO) principle. Elements are added and removed from the top only, 
            making them perfect for function calls, undo operations, and expression parsing.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Push Controls */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Push Element</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter a number"
                  value={pushValue}
                  onChange={(e) => setPushValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={handlePush}
                  disabled={!pushValue.trim()}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Push
                </button>
              </div>
            </div>
            
            {/* Stack Operations */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Stack Operations</label>
              <div className="flex gap-3">
                <button
                  onClick={handlePop}
                  disabled={stack.length === 0}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Pop
                </button>
                <button
                  onClick={handlePeek}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Peek
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation === 'push' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-semibold">✓ Pushed:</span>
                <span className="text-green-600 ml-2">Added element to top of stack</span>
              </div>
            )}
            
            {lastOperation === 'pop' && poppedValue !== null && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-700 font-semibold">✓ Popped:</span>
                <span className="text-red-600 ml-2">Removed {poppedValue} from top of stack</span>
              </div>
            )}
            
            {stack.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-700 font-semibold">⚠ Empty Stack:</span>
                <span className="text-yellow-600 ml-2">No elements to pop</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center">
            <div className="relative">
              {/* Stack Visualization Container */}
              <div className="flex flex-col items-center justify-end min-h-96 relative">
                
                {/* Stack Base */}
                <div className="w-40 h-6 bg-gray-300 border-2 border-gray-400 rounded-b-lg mb-1"></div>
                
                {/* Stack Elements */}
                <div className="flex flex-col-reverse items-center absolute bottom-6">
                  {stack.map((item, index) => (
                    <div
                      key={item.id}
                      className={`
                        w-40 h-14 border-2 flex items-center justify-center font-bold text-xl
                        transition-all duration-300 relative
                        ${index === stack.length - 1 
                          ? 'bg-blue-100 border-blue-400 text-blue-800 shadow-lg transform scale-105' 
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                        }
                        ${index === 0 ? 'rounded-b-lg' : ''}
                        ${index === stack.length - 1 ? 'rounded-t-lg' : ''}
                      `}
                      style={{
                        marginTop: index === 0 ? 0 : -2,
                        zIndex: stack.length - index
                      }}
                    >
                      {item.value}
                      
                      {/* Top indicator */}
                      {index === stack.length - 1 && (
                        <div className="absolute left-full ml-6 text-sm text-blue-600 font-bold whitespace-nowrap flex items-center">
                          <div className="w-4 h-0.5 bg-blue-600 mr-2"></div>
                          TOP (LIFO)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Empty Stack Message */}
                {stack.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-2xl font-bold mb-2">Empty Stack</div>
                      <div className="text-lg">Push elements to get started</div>
                    </div>
                  </div>
                )}
                
                {/* Stack Pointer Arrow */}
                {stack.length > 0 && (
                  <div 
                    className="absolute right-full mr-12 flex items-center"
                    style={{ 
                      bottom: `${24 + (stack.length * 56) - 28}px`
                    }}
                  >
                    <div className="text-sm text-gray-600 font-semibold whitespace-nowrap">Stack Pointer</div>
                    <div className="w-8 h-0.5 bg-blue-500 ml-3"></div>
                    <div className="w-0 h-0 border-l-4 border-l-blue-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Stack Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              Stack Size: <span className="font-bold text-blue-600">{stack.length}</span>
            </div>
            <div className="text-sm text-gray-500">
              LIFO Structure • Top-only access • O(1) operations
            </div>
            {stack.length > 0 && (
              <div className="text-lg text-blue-600">
                Top Element: <span className="font-bold">{stack[stack.length - 1].value}</span>
              </div>
            )}
            
            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Push:</strong> O(1) - Constant time</div>
                <div><strong>Pop:</strong> O(1) - Constant time</div>
                <div><strong>Peek:</strong> O(1) - Constant time</div>
                <div><strong>Space:</strong> O(n) - Linear space for n elements</div>
              </div>
            </div>
            
            {/* Operations Guide */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Stack Operations</h3>
              <div className="text-sm text-blue-700 space-y-1 text-left">
                <div>• <strong>Push:</strong> Add elements to the top of the stack</div>
                <div>• <strong>Pop:</strong> Remove and return the top element</div>
                <div>• <strong>Peek:</strong> View the top element without removing it</div>
                <div>• <strong>LIFO:</strong> Last-In-First-Out principle</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}