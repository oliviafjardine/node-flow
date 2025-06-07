import React from "react";
import Card from "../shared/Card";

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
    link: "/visualizations/divide-and-conquer",
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
    link: "/visualizations/sorting-algorithms",
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
    link: "/visualizations/searching-algorithms",
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
    link: "/visualizations/greedy-1",
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
    link: "/visualizations/greedy-2",
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
    link: "/visualizations/dp-1",
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
    link: "/visualizations/dp-2",
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
    link: "/visualizations/dp-3",
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
    link: "/visualizations/graph-traversals",
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
    link: "/visualizations/dijkstra-bellman",
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
    link: "/visualizations/topological-sorting",
    tags: ["DAG", "Topo"],
  },
];

const AlgorithmsSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-heading-2 text-4xl mb-8 text-center fade-in py-8">Algorithms</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {algorithms.map((algo) => (
          <Card key={algo.title} {...algo} />
        ))}
      </div>
    </section>
  );
};

export default AlgorithmsSection;
