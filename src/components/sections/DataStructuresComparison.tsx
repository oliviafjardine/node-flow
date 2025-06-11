import React from "react";
import ComparisonTable from "../shared/ComparisonTable";

const dataStructures = [
  {
    title: "Arrays",
    description: "Linear collection of elements stored in contiguous memory locations",
    timeComplexity: { access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)" },
    tags: ["Static", "Contiguous"],
  },
  {
    title: "Linked Lists",
    description: "Nodes connected by pointers. Good for dynamic memory usage.",
    timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
    tags: ["Dynamic", "Pointers"],
  },
  {
    title: "Stacks",
    description: "LIFO structure used in recursion, parsing, and undo features.",
    timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
    tags: ["LIFO", "Push/Pop"],
  },
  {
    title: "Queues",
    description: "FIFO structure used in task scheduling and BFS.",
    timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
    tags: ["FIFO", "Enqueue/Dequeue"],
  },
  {
    title: "Maps & Hash Tables",
    description: "Key-value pairs allowing fast lookups via hashing.",
    timeComplexity: { access: "N/A", search: "O(1)", insert: "O(1)", delete: "O(1)" },
    tags: ["Hashing", "Dictionaries"],
  },
  {
    title: "Graphs",
    description: "Nodes and edges used to represent relationships and networks.",
    timeComplexity: { access: "O(1)", search: "O(V+E)", insert: "O(1)", delete: "O(E)" },
    tags: ["Nodes", "Edges"],
  },
  {
    title: "Trees",
    description: "Hierarchical structures ideal for searching and sorting.",
    timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
    tags: ["Hierarchy", "Non-linear"],
  },
  {
    title: "Binary Trees & BSTs",
    description: "Binary trees with sorted node structure.",
    timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
    tags: ["Binary", "Sorted"],
  },
  {
    title: "Self-balancing Trees",
    description: "AVL, Red-Black, and Splay trees auto-balance to keep operations fast.",
    timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
    tags: ["AVL", "Red-Black", "Splay"],
  },
  {
    title: "Heaps",
    description: "Tree-based structures for fast min/max retrieval.",
    timeComplexity: { access: "O(1)", search: "O(n)", insert: "O(log n)", delete: "O(log n)" },
    tags: ["Priority Queue", "Binary Heap"],
  },
  {
    title: "Tries",
    description: "Prefix trees used in string search and autocomplete.",
    timeComplexity: { access: "O(L)", search: "O(L)", insert: "O(L)", delete: "O(L)" },
    tags: ["Prefix Tree", "Strings"],
  },
];

const DataStructuresComparison: React.FC = () => {
  const summaryInfo = [
    {
      title: "Best for Fast Access",
      items: ["Arrays", "Hash Tables", "Heaps (for min/max)"]
    },
    {
      title: "Best for Fast Search",
      items: ["Hash Tables", "Binary Search Trees", "Tries"]
    },
    {
      title: "Best for Fast Insert/Delete",
      items: ["Linked Lists", "Stacks", "Queues", "Hash Tables"]
    },
    {
      title: "Most Versatile",
      items: ["Arrays", "Hash Tables", "Binary Search Trees"]
    }
  ];

  return <ComparisonTable items={dataStructures} title="Data Structures" summaryInfo={summaryInfo} />;
};

export default DataStructuresComparison;
