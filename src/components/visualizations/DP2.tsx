import React from 'react';
import VisualizationLayout from './shared/VisualizationLayout';

const DP2Visualizer: React.FC = () => {
  return (
    <VisualizationLayout
      title="DP II: Longest Common Subsequence (LCS)"
      description="LCS finds the longest subsequence common to two sequences using dynamic programming. A subsequence maintains relative order but doesn't need to be contiguous."
      backLink="/algorithms"
      onReset={() => {}}
      controls={
        <div className="p-4 bg-accent-light border border-accent/20 rounded text-accent">
          This visualization is coming soon! The LCS algorithm will show how to build the DP table and trace back the actual subsequence.
        </div>
      }
      complexity={{
        time: "O(nm) where n, m are string lengths",
        space: "O(nm) for the DP table"
      }}
      operations={[
        "Create DP table dp[i][j] for strings of length i and j",
        "If characters match: dp[i][j] = dp[i-1][j-1] + 1",
        "If different: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "Trace back to reconstruct the LCS"
      ]}
    >
      <div className="w-full max-w-4xl">
        <div className="bg-surface border border-subtle rounded p-8 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-4">Coming Soon</h3>
          <p className="text-secondary mb-6">
            This visualization will show how to find the longest common subsequence between two strings using dynamic programming.
          </p>
          <div className="bg-surface-elevated border border-subtle rounded p-4">
            <h4 className="font-semibold text-primary mb-2">DP Recurrence:</h4>
            <div className="text-sm text-secondary text-left space-y-1">
              <p>• Base case: dp[0][j] = dp[i][0] = 0</p>
              <p>• If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1</p>
              <p>• Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</p>
              <p>• LCS length: dp[n][m]</p>
            </div>
          </div>
        </div>
      </div>
    </VisualizationLayout>
  );
};

export default DP2Visualizer;
