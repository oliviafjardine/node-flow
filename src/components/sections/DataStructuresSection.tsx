import React, { useState } from "react";
import Card from "../shared/Card";
import TopicRequestModal from "../shared/TopicRequestModal";
import {
  Grid,
  Link as LinkIcon,
  Layers,
  Repeat,
  Hash,
  Share2,
  TreeDeciduous,
  ArrowUpDown,
  Plus,
} from "lucide-react";

const dataStructures = [
  {
    title: "Arrays",
    description: "Linear collection of elements stored in contiguous memory locations",
    timeComplexity: { access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)" },
    link: "/visualizations/arrays",
    tags: ["Static", "Contiguous"],
    icon: <Grid className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Linked Lists",
    description: "Nodes connected by pointers. Good for dynamic memory usage.",
    timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
    link: "/visualizations/linked-lists",
    tags: ["Dynamic", "Pointers"],
    icon: <LinkIcon className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Stacks",
    description: "LIFO structure used in recursion, parsing, and undo features.",
    timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
    link: "/visualizations/stacks",
    tags: ["LIFO", "Push/Pop"],
    icon: <Layers className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Queues",
    description: "FIFO structure used in task scheduling and BFS.",
    timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
    link: "/visualizations/queues",
    tags: ["FIFO", "Enqueue/Dequeue"],
    icon: <Repeat className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Maps & Hash Tables",
    description: "Key-value pairs allowing fast lookups via hashing.",
    timeComplexity: { access: "N/A", search: "O(1)", insert: "O(1)", delete: "O(1)" },
    link: "/visualizations/hash-tables",
    tags: ["Hashing", "Dictionaries"],
    icon: <Hash className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Graphs",
    description: "Nodes and edges used to represent relationships and networks.",
    timeComplexity: { access: "O(1)", search: "O(V+E)", insert: "O(1)", delete: "O(E)" },
    link: "/visualizations/graphs",
    tags: ["Nodes", "Edges"],
    icon: <Share2 className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Trees",
    description: "Hierarchical structures ideal for searching and sorting.",
    timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
    link: "/visualizations/trees",
    tags: ["Hierarchy", "Non-linear"],
    icon: <TreeDeciduous className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Binary Trees & BSTs",
    description: "Binary trees with sorted node structure.",
    timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
    link: "/visualizations/binary-trees",
    tags: ["Binary", "Sorted"],
    icon: <TreeDeciduous className="w-6 h-6 text-heading-1" />,
  },

  {
    title: "Heaps",
    description: "Tree-based structures for fast min/max retrieval.",
    timeComplexity: { access: "O(1)", search: "O(n)", insert: "O(log n)", delete: "O(log n)" },
    link: "/visualizations/heaps",
    tags: ["Priority Queue", "Binary Heap"],
    icon: <ArrowUpDown className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Hash Tables",
    description: "Key-value pairs with O(1) average access time using hash functions.",
    timeComplexity: { access: "O(1)", search: "O(1)", insert: "O(1)", delete: "O(1)" },
    link: "/visualizations/hash-tables",
    tags: ["Hash", "Map", "Dictionary"],
    icon: <Hash className="w-6 h-6 text-heading-1" />,
  },
  {
    title: "Graphs",
    description: "Networks of vertices connected by edges, representing relationships.",
    timeComplexity: { access: "O(1)", search: "O(V+E)", insert: "O(1)", delete: "O(E)" },
    link: "/visualizations/graphs",
    tags: ["Graph", "Network", "Vertices"],
    icon: <Share2 className="w-6 h-6 text-heading-1" />,
  },

];

const DataStructuresSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent-light border border-accent/20 rounded-2xl flex items-center justify-center">
                <Grid className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-primary">Data Structures</h1>
            </div>
            <p className="text-secondary text-xl max-w-3xl leading-relaxed">
              Explore fundamental data structures and their time complexities through interactive visualizations and comprehensive explanations.
            </p>
          </div>

        </div>

        {/* Content */}
        <div className="space-y-12">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dataStructures.map((ds) => (
              <Card key={ds.title} {...ds} />
            ))}
          </div>

          {/* Can't find topic link */}
          <div className="text-center pt-6 border-t border-subtle">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated border border-subtle rounded text-secondary"
            >
              <Plus className="w-4 h-4" />
              <span>Can't find a data structure? Request it here</span>
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

export default DataStructuresSection;
