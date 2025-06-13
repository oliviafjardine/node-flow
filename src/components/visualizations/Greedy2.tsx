import React from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

const Greedy2Visualizer: React.FC = () => {
  return (
    <VisualizationLayout
      title="Greedy II: Fractional Knapsack"
      description="The fractional knapsack problem allows taking fractions of items to maximize value within weight constraints. The greedy approach sorts by value-to-weight ratio."
      backLink="/algorithms"
      onReset={() => {}}
      controls={
        <div className="p-4 bg-accent-light border border-accent/20 rounded text-accent">
          This visualization is coming soon! The fractional knapsack algorithm will demonstrate how greedy selection by value-to-weight ratio achieves optimal solutions.
        </div>
      }
      complexity={{
        time: "O(n log n) - dominated by sorting items by value/weight ratio",
        space: "O(1) - only constant extra space needed"
      }}
      operations={[
        "Sort items by value-to-weight ratio (descending)",
        "Greedily select items with highest ratio first",
        "Take fractions of items when capacity is exceeded",
        "Continue until knapsack is full"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="bg-surface border border-subtle rounded p-8 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-4">Coming Soon</h3>
          <p className="text-secondary mb-6">
            This visualization will show how the greedy fractional knapsack algorithm works by selecting items with the highest value-to-weight ratio first.
          </p>
          <div className="bg-surface-elevated border border-subtle rounded p-4">
            <h4 className="font-semibold text-primary mb-2">Algorithm Overview:</h4>
            <div className="text-sm text-secondary text-left space-y-1">
              <p>• Calculate value/weight ratio for each item</p>
              <p>• Sort items by ratio in descending order</p>
              <p>• Greedily select items until capacity is reached</p>
              <p>• Take fraction of last item if needed</p>
            </div>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default Greedy2Visualizer;
