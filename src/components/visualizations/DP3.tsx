import React from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

const DP3Visualizer: React.FC = () => {
  return (
    <VisualizationLayout
      title="DP III: Longest Increasing Subsequence (LIS)"
      description="LIS finds the longest subsequence where elements are in strictly increasing order. The efficient solution uses binary search with dynamic programming."
      backLink="/algorithms"
      onReset={() => {}}
      controls={
        <div className="p-4 bg-accent-light border border-accent/20 rounded text-accent">
          This visualization is coming soon! The LIS algorithm will demonstrate both the O(n²) DP solution and the O(n log n) binary search optimization.
        </div>
      }
      complexity={{
        time: "O(n²) naive DP, O(n log n) with binary search",
        space: "O(n) for the DP array"
      }}
      operations={[
        "O(n²) approach: dp[i] = max length ending at index i",
        "For each i, check all j < i where arr[j] < arr[i]",
        "O(n log n): maintain array of smallest tail elements",
        "Use binary search to find insertion position"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="bg-surface border border-subtle rounded p-8 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-4">Coming Soon</h3>
          <p className="text-secondary mb-6">
            This visualization will show both the classic O(n²) DP solution and the optimized O(n log n) binary search approach for LIS.
          </p>
          <div className="bg-surface-elevated border border-subtle rounded p-4">
            <h4 className="font-semibold text-primary mb-2">Two Approaches:</h4>
            <div className="text-sm text-secondary text-left space-y-2">
              <div>
                <p className="font-medium">O(n²) DP:</p>
                <p>• dp[i] = max(dp[j] + 1) for all j &lt; i where arr[j] &lt; arr[i]</p>
              </div>
              <div>
                <p className="font-medium">O(n log n) Binary Search:</p>
                <p>• Maintain tails[] array of smallest ending elements</p>
                <p>• Binary search for position to replace/extend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default DP3Visualizer;
