import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DPCell {
  value: number;
  isActive?: boolean;
  isComputed?: boolean;
  choice?: 'match' | 'left' | 'up';
  char1?: string;
  char2?: string;
}

export default function DP2Visualizer() {
  const [string1, setString1] = useState('ABCDGH');
  const [string2, setString2] = useState('AEDFHR');
  const [dpTable, setDpTable] = useState<DPCell[][]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [lcsLength, setLcsLength] = useState(0);
  const [lcsString, setLcsString] = useState('');
  const [highlightedCells, setHighlightedCells] = useState<{i: number, j: number}[]>([]);

  const resetVisualization = useCallback(() => {
    const rows = string1.length + 1;
    const cols = string2.length + 1;
    const newTable: DPCell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({ value: 0 }))
    );

    setDpTable(newTable);
    setCurrentStep(0);
    setCurrentI(0);
    setCurrentJ(0);
    setLastOperation(null);
    setLcsLength(0);
    setLcsString('');
    setHighlightedCells([]);
    setIsPlaying(false);
  }, [string1.length, string2.length]);

  const lcsDP = useCallback(async () => {
    if (isPlaying) return;

    resetVisualization();
    setIsPlaying(true);

    const n = string1.length;
    const m = string2.length;
    const dp: DPCell[][] = Array(n + 1).fill(null).map(() =>
      Array(m + 1).fill(null).map(() => ({ value: 0 }))
    );

    setLastOperation('Initializing DP table with base cases (empty string has LCS length 0)');
    setDpTable([...dp]);
    await new Promise(resolve => setTimeout(resolve, 2000));

    let step = 0;

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        step++;
        setCurrentStep(step);
        setCurrentI(i);
        setCurrentJ(j);

        const char1 = string1[i - 1];
        const char2 = string2[j - 1];

        // Highlight current cell
        dp[i][j].isActive = true;
        dp[i][j].char1 = char1;
        dp[i][j].char2 = char2;
        setDpTable([...dp]);

        setLastOperation(`Comparing '${char1}' (string1[${i-1}]) with '${char2}' (string2[${j-1}])`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (char1 === char2) {
          // Characters match
          dp[i][j].value = dp[i - 1][j - 1].value + 1;
          dp[i][j].choice = 'match';
          setLastOperation(`Characters match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j].value}`);
        } else {
          // Characters don't match
          const fromLeft = dp[i][j - 1].value;
          const fromUp = dp[i - 1][j].value;

          if (fromLeft >= fromUp) {
            dp[i][j].value = fromLeft;
            dp[i][j].choice = 'left';
            setLastOperation(`No match. Take max: left=${fromLeft}, up=${fromUp}. Choose left: ${dp[i][j].value}`);
          } else {
            dp[i][j].value = fromUp;
            dp[i][j].choice = 'up';
            setLastOperation(`No match. Take max: left=${fromLeft}, up=${fromUp}. Choose up: ${dp[i][j].value}`);
          }
        }

        dp[i][j].isComputed = true;
        dp[i][j].isActive = false;
        setDpTable([...dp]);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    }

    setLcsLength(dp[n][m].value);
    setLastOperation(`DP table completed! LCS length: ${dp[n][m].value}`);

    // Backtrack to find the actual LCS
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastOperation('Backtracking to find the actual LCS...');

    const lcs: string[] = [];
    const path: {i: number, j: number}[] = [];
    let i = n, j = m;

    while (i > 0 && j > 0) {
      path.push({i, j});

      if (dp[i][j].choice === 'match') {
        lcs.unshift(string1[i - 1]);
        i--;
        j--;
      } else if (dp[i][j].choice === 'left') {
        j--;
      } else {
        i--;
      }

      setHighlightedCells([...path]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setLcsString(lcs.join(''));
    setLastOperation(`Backtracking complete! LCS: "${lcs.join('')}"`);
    setIsPlaying(false);
  }, [string1, string2, isPlaying, resetVisualization]);

  const handleReset = () => {
    setString1('ABCDGH');
    setString2('AEDFHR');
    resetVisualization();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">DP II: Longest Common Subsequence (LCS)</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            LCS finds the longest subsequence common to two sequences using dynamic programming.
            A subsequence maintains relative order but doesn't need to be contiguous.
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
                  onClick={lcsDP}
                  disabled={isPlaying}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPlaying ? 'Running LCS...' : 'Start LCS Algorithm'}
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

            {/* String Inputs */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Input Strings</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={string1}
                  onChange={(e) => setString1(e.target.value.toUpperCase())}
                  disabled={isPlaying}
                  placeholder="String 1"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100 font-mono"
                />
                <input
                  type="text"
                  value={string2}
                  onChange={(e) => setString2(e.target.value.toUpperCase())}
                  disabled={isPlaying}
                  placeholder="String 2"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Current Position</div>
              <div className="text-lg font-bold text-green-600">[{currentI}, {currentJ}]</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">LCS Length</div>
              <div className="text-lg font-bold text-blue-600">{lcsLength}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Step</div>
              <div className="text-lg font-bold text-purple-600">{currentStep}</div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="mt-6 space-y-3">
            {lastOperation && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 font-semibold">Status:</span>
                <span className="text-green-600 ml-2">{lastOperation}</span>
              </div>
            )}

            {lcsString && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">LCS Found:</span>
                <span className="text-blue-600 ml-2 font-mono text-lg">"{lcsString}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            {/* String Display */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Input Strings</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">String 1</div>
                  <div className="flex justify-center gap-1">
                    {string1.split('').map((char, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 border-2 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                          currentI > 0 && index === currentI - 1
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                            : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">String 2</div>
                  <div className="flex justify-center gap-1">
                    {string2.split('').map((char, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 border-2 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                          currentJ > 0 && index === currentJ - 1
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                            : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
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
                        <th className="border border-gray-300 px-3 py-2 bg-gray-100"></th>
                        <th className="border border-gray-300 px-3 py-2 bg-gray-100">∅</th>
                        {string2.split('').map((char, j) => (
                          <th key={j} className="border border-gray-300 px-3 py-2 bg-gray-100 min-w-[50px]">
                            {char}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dpTable.map((row, i) => (
                        <tr key={i}>
                          <td className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold">
                            {i === 0 ? '∅' : string1[i - 1]}
                          </td>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`border border-gray-300 px-3 py-2 text-center transition-all duration-300 ${
                                cell.isActive
                                  ? 'bg-yellow-200 border-yellow-400'
                                  : highlightedCells.some(pos => pos.i === i && pos.j === j)
                                  ? 'bg-purple-200 border-purple-400'
                                  : cell.isComputed
                                  ? cell.choice === 'match'
                                    ? 'bg-green-100'
                                    : cell.choice === 'left'
                                    ? 'bg-blue-100'
                                    : 'bg-red-100'
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
                    <span>Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
                    <span>From Left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-gray-300"></div>
                    <span>From Up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-200 border border-purple-400"></div>
                    <span>LCS Path</span>
                  </div>
                </div>
              </div>
            )}

            {/* Result Display */}
            {lcsString && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Longest Common Subsequence</h3>
                <div className="flex justify-center gap-1 mb-2">
                  {lcsString.split('').map((char, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="w-10 h-10 bg-green-100 border-2 border-green-400 rounded flex items-center justify-center font-bold text-green-800"
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Length: {lcsLength} characters
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Info */}
          <div className="mt-8 text-center space-y-3 border-t pt-6">
            <div className="text-lg text-gray-700">
              String 1 Length: <span className="font-bold text-green-600">{string1.length}</span>
              {' | '}
              String 2 Length: <span className="font-bold text-blue-600">{string2.length}</span>
              {lcsLength > 0 && (
                <>
                  {' | '}
                  LCS Length: <span className="font-bold text-purple-600">{lcsLength}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Dynamic programming • Longest common subsequence • Optimal substructure
            </div>

            {/* Complexity Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Time & Space Complexity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Time:</strong> O(n × m) - Fill DP table of size n × m</div>
                <div><strong>Space:</strong> O(n × m) - Store DP table (can be optimized to O(min(n,m)))</div>
                <div><strong>Recurrence:</strong> If match: dp[i][j] = dp[i-1][j-1] + 1, else: max(dp[i-1][j], dp[i][j-1])</div>
                <div><strong>Base Case:</strong> dp[0][j] = dp[i][0] = 0 (empty string has LCS length 0)</div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="mt-4 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">LCS Algorithm Steps</h3>
              <div className="text-sm text-green-700 space-y-1 text-left">
                <div>• <strong>State:</strong> dp[i][j] = LCS length of first i chars of string1 and first j chars of string2</div>
                <div>• <strong>Match:</strong> If characters match, add 1 to diagonal value</div>
                <div>• <strong>No Match:</strong> Take maximum from left or up cell</div>
                <div>• <strong>Backtrack:</strong> Trace path to reconstruct actual LCS string</div>
              </div>
            </div>

            {/* Python Code Example */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Python Implementation Example</h3>
              <div className="text-left">
                <pre className="text-sm text-gray-700 font-mono bg-gray-100 p-3 rounded overflow-x-auto">
{`def longest_common_subsequence(str1, str2):
    """
    Find LCS using Dynamic Programming
    Time: O(n*m), Space: O(n*m)

    Args:
        str1, str2: Input strings

    Returns:
        (lcs_length, lcs_string)
    """
    n, m = len(str1), len(str2)

    # Create DP table: dp[i][j] = LCS length of str1[:i] and str2[:j]
    dp = [[0 for _ in range(m + 1)] for _ in range(n + 1)]

    # Fill the DP table
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if str1[i-1] == str2[j-1]:
                # Characters match: add 1 to diagonal
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # No match: take maximum from left or up
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    # Backtrack to find the actual LCS
    lcs = []
    i, j = n, m

    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            # Character is part of LCS
            lcs.append(str1[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            # Came from up
            i -= 1
        else:
            # Came from left
            j -= 1

    return dp[n][m], ''.join(reversed(lcs))

def lcs_space_optimized(str1, str2):
    """
    Space-optimized version using O(min(n,m)) space
    """
    # Make str1 the shorter string
    if len(str1) > len(str2):
        str1, str2 = str2, str1

    n, m = len(str1), len(str2)

    # Use only two rows instead of full table
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)

    for j in range(1, m + 1):
        for i in range(1, n + 1):
            if str1[i-1] == str2[j-1]:
                curr[i] = prev[i-1] + 1
            else:
                curr[i] = max(prev[i], curr[i-1])

        # Swap rows for next iteration
        prev, curr = curr, prev

    return prev[n]

def print_lcs_table(str1, str2):
    """
    Print the DP table for visualization
    """
    n, m = len(str1), len(str2)
    dp = [[0 for _ in range(m + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    # Print table
    print("    ", end="")
    for char in " " + str2:
        print(f"{char:3}", end="")
    print()

    for i in range(n + 1):
        char = " " if i == 0 else str1[i-1]
        print(f"{char:3} ", end="")
        for j in range(m + 1):
            print(f"{dp[i][j]:3}", end="")
        print()

# Usage example
str1 = "ABCDGH"
str2 = "AEDFHR"

length, lcs = longest_common_subsequence(str1, str2)
print(f"String 1: {str1}")
print(f"String 2: {str2}")
print(f"LCS Length: {length}")
print(f"LCS: {lcs}")

print("\\nDP Table:")
print_lcs_table(str1, str2)

# Space-optimized version
length_opt = lcs_space_optimized(str1, str2)
print(f"\\nSpace-optimized result: {length_opt}")

# Applications of LCS:
# - DNA sequence analysis
# - File diff utilities
# - Plagiarism detection
# - Version control systems`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
