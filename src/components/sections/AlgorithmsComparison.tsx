import React from "react";
import ComparisonTable from "../shared/ComparisonTable";

const algorithms = [
  {
    title: "Divide and Conquer",
    description: "Break problems into subproblems, solve them, and combine results.",
    timeComplexity: {
      access: "N/A",
      search: "O(log n) - O(n log n)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["Recursion", "Merge"],
  },
  {
    title: "Sorting Algorithms",
    description: "Includes Quick Sort, Merge Sort, and more.",
    timeComplexity: {
      access: "N/A",
      search: "O(n)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["Bubble", "Merge", "Quick", "Counting", "Radix"],
  },
  {
    title: "Searching Algorithms",
    description: "Linear and Binary Search for finding values in arrays.",
    timeComplexity: {
      access: "N/A",
      search: "O(n) / O(log n)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["Linear", "Binary"],
  },
  {
    title: "Greedy I: Non-overlapping Intervals",
    description: "Maximize the number of non-overlapping intervals.",
    timeComplexity: {
      access: "N/A",
      search: "O(n log n)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["Greedy", "Scheduling"],
  },
  {
    title: "Greedy II: Fractional Knapsack",
    description: "Maximize value by choosing fractions of items.",
    timeComplexity: {
      access: "N/A",
      search: "O(n log n)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["Greedy", "Knapsack"],
  },
  {
    title: "DP I: 0–1 Knapsack",
    description: "Use dynamic programming to maximize value under weight constraints.",
    timeComplexity: {
      access: "N/A",
      search: "O(nW)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["DP", "Knapsack"],
  },
  {
    title: "DP II: LCS",
    description: "Finds longest common subsequence between two strings.",
    timeComplexity: {
      access: "N/A",
      search: "O(nm)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["DP", "Strings"],
  },
  {
    title: "DP III: LIS",
    description: "Finds the longest increasing subsequence.",
    timeComplexity: {
      access: "N/A",
      search: "O(n log n)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["DP", "Subsequences"],
  },
  {
    title: "Graph Traversals",
    description: "Explore nodes with BFS and DFS.",
    timeComplexity: {
      access: "O(1)",
      search: "O(V + E)",
      insert: "O(1)",
      delete: "O(1)",
    },
    tags: ["DFS", "BFS"],
  },
  {
    title: "Dijkstra & Bellman-Ford",
    description: "Shortest path algorithms on weighted graphs.",
    timeComplexity: {
      access: "N/A",
      search: "O(V^2) or O(E + V log V)",
      insert: "N/A",
      delete: "N/A",
    },
    tags: ["Shortest Path"],
  },
  {
    title: "Topological Sorting",
    description: "Order nodes in a DAG.",
    timeComplexity: {
      access: "O(1)",
      search: "O(V + E)",
      insert: "O(1)",
      delete: "O(1)",
    },
    tags: ["DAG", "Topo"],
  },
];

const AlgorithmsComparison: React.FC = () => {
  const summaryInfo = [
    {
      title: "Fastest Search Algorithms",
      items: ["Binary Search O(log n)", "Hash Table Lookup O(1)"]
    },
    {
      title: "Efficient Sorting",
      items: ["Merge Sort O(n log n)", "Quick Sort O(n log n) avg"]
    },
    {
      title: "Graph Algorithms",
      items: ["BFS/DFS O(V+E)", "Dijkstra O(E + V log V)"]
    },
    {
      title: "Dynamic Programming",
      items: ["Knapsack O(nW)", "LCS O(nm)", "LIS O(n log n)"]
    }
  ];

  return <ComparisonTable items={algorithms} title="Algorithms" summaryInfo={summaryInfo} />;
};

export default AlgorithmsComparison;
