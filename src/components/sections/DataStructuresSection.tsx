import React from "react";
import Card from "../shared/Card";
import {
  Grid,
  Link as LinkIcon,
  Layers,
  Repeat,
  Hash,
  Share2,
  TreeDeciduous,
  ShieldCheck,
  ArrowUpDown,
  Search,
} from "lucide-react";

const dataStructures = [
  {
    title: "Arrays",
    description: "Linear collection of elements stored in contiguous memory locations",
    timeComplexity: { access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)" },
    link: "./components/visualizations/Arrays",
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
    title: "Self-balancing Trees",
    description: "AVL, Red-Black, and Splay trees auto-balance to keep operations fast.",
    timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
    link: "/visualizations/self-balancing-trees",
    tags: ["AVL", "Red-Black", "Splay"],
    icon: <ShieldCheck className="w-6 h-6 text-heading-1" />,
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
    title: "Tries",
    description: "Prefix trees used in string search and autocomplete.",
    timeComplexity: { access: "O(L)", search: "O(L)", insert: "O(L)", delete: "O(L)" },
    link: "/visualizations/tries",
    tags: ["Prefix Tree", "Strings"],
    icon: <Search className="w-6 h-6 text-heading-1" />,
  },
];

const DataStructuresSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-heading-2 text-4xl mb-8 text-center fade-in py-8">Data Structures</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataStructures.map((ds) => (
          <Card key={ds.title} {...ds} />
        ))}
      </div>
    </section>
  );
};

export default DataStructuresSection;
