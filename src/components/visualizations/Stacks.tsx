import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';

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
    if (isNaN(value)) return;

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
    if (stack.length === 0) return null;
    return stack[stack.length - 1].value;
  };

  const handleReset = () => {
    setStack(generateRandomStack());
    setPushValue('');
    setLastOperation(null);
    setPoppedValue(null);
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Push Element</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value to push"
              value={pushValue}
              onChange={(e) => setPushValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePush()}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={handlePush}
              disabled={!pushValue}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Push
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Stack Operations</label>
          <div className="flex gap-2">
            <button
              onClick={handlePop}
              disabled={stack.length === 0}
              className="flex-1 px-4 py-2 bg-error text-inverse rounded-lg hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Pop
            </button>
            <button
              onClick={() => {
                const topValue = handlePeek();
                if (topValue !== null) {
                  alert(`Top element: ${topValue}`);
                } else {
                  alert('Stack is empty');
                }
              }}
              className="flex-1 px-4 py-2 bg-warning text-inverse rounded-lg hover:bg-warning-dark transition-colors"
            >
              Peek
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      <div className="space-y-2">
        {lastOperation === 'push' && (
          <div className="p-3 bg-success-light border border-success/20 rounded-lg">
            <span className="text-success font-medium">Pushed:</span> Added element to top of stack
          </div>
        )}
        
        {lastOperation === 'pop' && poppedValue !== null && (
          <div className="p-3 bg-error-light border border-error/20 rounded-lg">
            <span className="text-error font-medium">Popped:</span> Removed {poppedValue} from top of stack
          </div>
        )}
        
        {stack.length === 0 && (
          <div className="p-3 bg-warning-light border border-warning/20 rounded-lg">
            <span className="text-warning font-medium">Empty Stack:</span> No elements to pop
          </div>
        )}
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Stack Visualization"
      description="Stacks follow the Last-In-First-Out (LIFO) principle. Elements are added and removed from the top only, making them perfect for function calls, undo operations, and expression parsing."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Push: O(1), Pop: O(1), Peek: O(1)",
        space: "O(n)"
      }}
      operations={[
        "Push: Add elements to the top of the stack",
        "Pop: Remove and return the top element",
        "Peek: View the top element without removing it",
        "Stack follows LIFO (Last-In-First-Out) principle"
      ]}
    >
      <div className="w-full max-w-2xl">
        {/* Stack Visualization */}
        <div className="flex flex-col items-center justify-end min-h-[400px] relative">
          {/* Stack Base */}
          <div className="w-32 h-4 bg-subtle border-2 border-subtle rounded-b-lg"></div>
          
          {/* Stack Elements */}
          <div className="flex flex-col-reverse items-center">
            <AnimatePresence>
              {stack.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ 
                    scale: 0, 
                    opacity: 0, 
                    y: -50 
                  }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0 
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0, 
                    y: -50,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className={`
                    w-32 h-12 border-2 flex items-center justify-center font-bold text-lg
                    transition-all duration-200
                    ${index === stack.length - 1 
                      ? 'bg-accent-light border-accent text-accent shadow-lg' 
                      : 'bg-surface-elevated border-subtle text-primary'
                    }
                    ${index === 0 ? 'rounded-b-lg' : ''}
                  `}
                  style={{
                    marginTop: index === 0 ? 0 : -2 // Overlap borders
                  }}
                >
                  {item.value}
                  
                  {/* Top indicator */}
                  {index === stack.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute left-full ml-4 text-sm text-accent font-medium"
                    >
                      ← TOP
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Empty Stack Message */}
          {stack.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center text-muted"
            >
              <div className="text-center">
                <div className="text-lg font-medium">Empty Stack</div>
                <div className="text-sm">Push elements to get started</div>
              </div>
            </motion.div>
          )}
          
          {/* Stack Pointer */}
          {stack.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-full mr-8 flex items-center"
              style={{ 
                top: `${400 - (stack.length * 48) - 24}px` // Position at top element
              }}
            >
              <div className="text-sm text-secondary font-medium">Stack Pointer</div>
              <div className="w-8 h-0.5 bg-accent ml-2"></div>
            </motion.div>
          )}
        </div>
        
        {/* Stack Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-secondary">
            Stack Size: <span className="font-semibold text-primary">{stack.length}</span>
          </div>
          <div className="text-xs text-muted">
            LIFO Structure • Top-only access • O(1) operations
          </div>
          {stack.length > 0 && (
            <div className="text-sm text-accent">
              Top Element: <span className="font-semibold">{stack[stack.length - 1].value}</span>
            </div>
          )}
        </div>
      </div>
    </VisualizationLayout>
  );
}
