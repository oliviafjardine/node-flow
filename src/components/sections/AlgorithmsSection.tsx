import React, { useState } from "react";
import Card from "../shared/Card";
import TopicRequestModal from "../shared/TopicRequestModal";
import { Zap, Plus } from "lucide-react";

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
    title: "Binary Search",
    description: "Efficiently find elements in sorted arrays using divide and conquer.",
    timeComplexity: {
      access: "N/A",
      search: "O(log n)",
      insert: "N/A",
      delete: "N/A",
    },
    link: "/visualizations/binary-search",
    tags: ["Binary", "Divide & Conquer"],
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

];

const AlgorithmsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent-light border border-accent/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-primary">Algorithms</h1>
            </div>
            <p className="text-secondary text-xl max-w-3xl leading-relaxed">
              Discover essential algorithms and their time complexities through step-by-step visualizations and comprehensive explanations.
            </p>
          </div>

        </div>

        {/* Content */}
        <div className="space-y-12">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {algorithms.map((algo) => (
              <Card key={algo.title} {...algo} />
            ))}
          </div>

          {/* Can't find topic link */}
          <div className="text-center pt-6 border-t border-subtle">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated border border-subtle rounded text-secondary"
            >
              <Plus className="w-4 h-4" />
              <span>Can't find an algorithm? Request it here</span>
            </button>
          </div>
        </div>

        {/* Topic Request Modal */}
        <TopicRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default AlgorithmsSection;
