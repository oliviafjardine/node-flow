import React from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

const DP1Visualizer: React.FC = () => {
  return (
    <VisualizationLayout
      title="DP I: 0-1 Knapsack"
      description="The 0-1 knapsack problem uses dynamic programming to find the optimal subset of items that maximizes value within weight constraints. Each item can only be taken once."
      backLink="/algorithms"
      onReset={() => {}}
      controls={
        <div className="p-4 bg-accent-light border border-accent/20 rounded text-accent">
          This visualization is coming soon! The 0-1 knapsack DP solution will show how to build up optimal solutions using a 2D table.
        </div>
      }
      complexity={{
        time: "O(nW) where n = items, W = capacity",
        space: "O(nW) for the DP table"
      }}
      operations={[
        "Create DP table dp[i][w] for i items and weight w",
        "For each item, decide: include or exclude",
        "dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])",
        "Trace back to find selected items"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="bg-surface border border-subtle rounded p-8 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-4">Coming Soon</h3>
          <p className="text-secondary mb-6">
            This visualization will demonstrate the 0-1 knapsack dynamic programming solution with a visual DP table.
          </p>
          <div className="bg-surface-elevated border border-subtle rounded p-4">
            <h4 className="font-semibold text-primary mb-2">DP Recurrence:</h4>
            <div className="text-sm text-secondary text-left space-y-1">
              <p>• Base case: dp[0][w] = 0 for all w</p>
              <p>• If weight[i] &gt; w: dp[i][w] = dp[i-1][w]</p>
              <p>• Else: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])</p>
              <p>• Answer: dp[n][W]</p>
            </div>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default DP1Visualizer;
