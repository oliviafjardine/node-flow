import React from "react";
import Card from "../Card";

const algorithms = [
  {
    title: "Divide and Conquer",
    description: "Breaks a problem into smaller subproblems, solves them recursively, and combines the results.",
    tags: ["Recursion", "Subproblems", "Merge & Conquer"],
    link: "/visualizations/divide-and-conquer",
  },
  {
    title: "Sorting Algorithms",
    description: "Includes Bubble Sort, Counting Sort, Quick Sort, Merge Sort, and Radix Sort.",
    tags: ["Comparison-based", "Non-comparison", "O(n log n)"],
    link: "/visualizations/sorting-algorithms",
  },
  {
    title: "Searching Algorithms",
    description: "Searches data with techniques like Linear Search and Binary Search.",
    tags: ["Search", "Linear", "Binary"],
    link: "/visualizations/searching-algorithms",
  },
  {
    title: "Greedy I: Non-overlapping Intervals",
    description: "Finds the maximum number of non-overlapping intervals using a greedy approach.",
    tags: ["Greedy", "Intervals", "Scheduling"],
    link: "/visualizations/greedy-1",
  },
  {
    title: "Greedy II: Fractional Knapsack",
    description: "Solves the knapsack problem by selecting the most valuable items per unit weight.",
    tags: ["Greedy", "Knapsack", "Fractional"],
    link: "/visualizations/greedy-2",
  },
  {
    title: "DP I: 0–1 Knapsack",
    description: "Uses dynamic programming to find the optimal subset of items without exceeding capacity.",
    tags: ["DP", "0-1 Knapsack", "Subset Sum"],
    link: "/visualizations/dp-1",
  },
  {
    title: "DP II: Longest Common Subsequence",
    description: "Finds the longest sequence that appears in the same relative order in two strings.",
    tags: ["DP", "LCS", "Strings"],
    link: "/visualizations/dp-2",
  },
  {
    title: "DP III: Longest Increasing Subsequence",
    description: "Determines the longest subsequence of increasing numbers using DP.",
    tags: ["DP", "LIS", "Subsequences"],
    link: "/visualizations/dp-3",
  },
  {
    title: "Graph Traversals",
    description: "Breadth-First Search and Depth-First Search algorithms for exploring graphs.",
    tags: ["BFS", "DFS", "Traversal"],
    link: "/visualizations/graph-traversals",
  },
  {
    title: "Dijkstra & Bellman-Ford Algorithms",
    description: "Shortest path algorithms for weighted graphs, with different handling of negative weights.",
    tags: ["Shortest Path", "Dijkstra", "Bellman-Ford"],
    link: "/visualizations/dijkstra-bellman",
  },
  {
    title: "Topological Sorting",
    description: "Linear ordering of vertices in a Directed Acyclic Graph (DAG).",
    tags: ["DAG", "Topo Sort", "Graph"],
    link: "/visualizations/topological-sorting",
  },
];

const AlgorithmsSection: React.FC = () => {
  return (
    <section className="section-outer">
      <h2 className="text-heading-2 text-4xl mb-8 text-center fade-in">Algorithms</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {algorithms.map((algo) => (
          <Card
            key={algo.title}
            title={algo.title}
            description={algo.description}
            tags={algo.tags}
            link={algo.link}
          />
        ))}
      </div>
    </section>
  );
};

export default AlgorithmsSection;
