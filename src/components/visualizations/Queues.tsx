import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from './shared/VisualizationLayout';

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
  const [lastOperation, setLastOperation] = useState<'enqueue' | 'dequeue' | null>(null);
  const [dequeuedValue, setDequeuedValue] = useState<number | null>(null);

  const handleEnqueue = () => {
    const value = parseInt(enqueueValue);
    if (isNaN(value)) return;

    const newItem: QueueItem = {
      id: `item-${Date.now()}`,
      value,
      timestamp: Date.now()
    };

    setQueue(prev => [...prev, newItem]);
    setEnqueueValue('');
    setLastOperation('enqueue');
    setDequeuedValue(null);
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;

    const dequeuedItem = queue[0];
    setQueue(prev => prev.slice(1));
    setLastOperation('dequeue');
    setDequeuedValue(dequeuedItem.value);
  };

  const handleFront = () => {
    if (queue.length === 0) return null;
    return queue[0].value;
  };

  const handleRear = () => {
    if (queue.length === 0) return null;
    return queue[queue.length - 1].value;
  };

  const handleReset = () => {
    setQueue(generateRandomQueue());
    setEnqueueValue('');
    setLastOperation(null);
    setDequeuedValue(null);
  };

  const controls = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Enqueue Element</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Value to enqueue"
              value={enqueueValue}
              onChange={(e) => setEnqueueValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
              className="flex-1 px-3 py-2 border border-subtle rounded-lg bg-surface text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              onClick={handleEnqueue}
              disabled={!enqueueValue}
              className="px-4 py-2 bg-accent text-inverse rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Enqueue
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Queue Operations</label>
          <div className="flex gap-2">
            <button
              onClick={handleDequeue}
              disabled={queue.length === 0}
              className="flex-1 px-4 py-2 bg-error text-inverse rounded-lg hover:bg-error-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Dequeue
            </button>
            <button
              onClick={() => {
                const frontValue = handleFront();
                const rearValue = handleRear();
                if (frontValue !== null && rearValue !== null) {
                  alert(`Front: ${frontValue}, Rear: ${rearValue}`);
                } else {
                  alert('Queue is empty');
                }
              }}
              className="flex-1 px-4 py-2 bg-warning text-inverse rounded-lg hover:bg-warning-dark transition-colors"
            >
              Front/Rear
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      <div className="space-y-2">
        {lastOperation === 'enqueue' && (
          <div className="p-3 bg-success-light border border-success/20 rounded-lg">
            <span className="text-success font-medium">Enqueued:</span> Added element to rear of queue
          </div>
        )}
        
        {lastOperation === 'dequeue' && dequeuedValue !== null && (
          <div className="p-3 bg-error-light border border-error/20 rounded-lg">
            <span className="text-error font-medium">Dequeued:</span> Removed {dequeuedValue} from front of queue
          </div>
        )}
        
        {queue.length === 0 && (
          <div className="p-3 bg-warning-light border border-warning/20 rounded-lg">
            <span className="text-warning font-medium">Empty Queue:</span> No elements to dequeue
          </div>
        )}
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      title="Queue Visualization"
      description="Queues follow the First-In-First-Out (FIFO) principle. Elements are added at the rear and removed from the front, making them ideal for task scheduling, breadth-first search, and buffering."
      backLink="/data-structures"
      onReset={handleReset}
      controls={controls}
      complexity={{
        time: "Enqueue: O(1), Dequeue: O(1), Front/Rear: O(1)",
        space: "O(n)"
      }}
      operations={[
        "Enqueue: Add elements to the rear of the queue",
        "Dequeue: Remove and return the front element",
        "Front: View the front element without removing it",
        "Queue follows FIFO (First-In-First-Out) principle"
      ]}
    >
      <div className="w-full max-w-4xl">
        {/* Queue Visualization */}
        <div className="flex items-center justify-center min-h-[300px] relative">
          {/* Queue Container */}
          <div className="relative">
            {/* Front and Rear Labels */}
            <div className="absolute -top-8 left-0 text-sm text-accent font-medium">
              FRONT
            </div>
            <div className="absolute -top-8 right-0 text-sm text-accent font-medium">
              REAR
            </div>
            
            {/* Queue Elements */}
            <div className="flex items-center border-2 border-subtle rounded-lg min-w-[400px] min-h-[80px] p-2">
              <AnimatePresence mode="popLayout">
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ 
                      scale: 0, 
                      opacity: 0,
                      x: index === queue.length - 1 ? 100 : 0 // New items come from right
                    }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      x: 0 
                    }}
                    exit={{ 
                      scale: 0, 
                      opacity: 0, 
                      x: -100, // Removed items go left
                      transition: { duration: 0.3 }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    layout
                    className={`
                      w-16 h-16 border-2 rounded-lg flex items-center justify-center font-bold text-lg
                      transition-all duration-200 mx-1
                      ${index === 0 
                        ? 'bg-error-light border-error text-error' // Front element
                        : index === queue.length - 1
                        ? 'bg-success-light border-success text-success' // Rear element
                        : 'bg-surface-elevated border-subtle text-primary'
                      }
                    `}
                  >
                    {item.value}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Empty Queue Message */}
              {queue.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex items-center justify-center text-muted"
                >
                  <div className="text-center">
                    <div className="text-lg font-medium">Empty Queue</div>
                    <div className="text-sm">Enqueue elements to get started</div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Direction Arrows */}
            {queue.length > 0 && (
              <>
                {/* Dequeue Arrow (Front) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12"
                >
                  <div className="flex items-center text-error">
                    <div className="text-sm font-medium">Dequeue</div>
                    <div className="ml-2">←</div>
                  </div>
                </motion.div>
                
                {/* Enqueue Arrow (Rear) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12"
                >
                  <div className="flex items-center text-success">
                    <div className="mr-2">→</div>
                    <div className="text-sm font-medium">Enqueue</div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
        
        {/* Queue Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-sm text-secondary">
            Queue Size: <span className="font-semibold text-primary">{queue.length}</span>
          </div>
          <div className="text-xs text-muted">
            FIFO Structure • Front/Rear access • O(1) operations
          </div>
          {queue.length > 0 && (
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-error">
                Front: <span className="font-semibold">{queue[0].value}</span>
              </div>
              <div className="text-success">
                Rear: <span className="font-semibold">{queue[queue.length - 1].value}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </VisualizationLayout>
  );
}
