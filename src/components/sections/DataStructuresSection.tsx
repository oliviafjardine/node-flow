import React from "react";
import Card from "../Card";

const dataStructures = [
  {
    title: "Array",
    description: "A collection of elements identified by index. Supports fast access but has fixed size.",
    tags: ["Static", "Indexed", "O(1) access"],
  },
  {
    title: "Linked List",
    description: "A linear structure where elements point to the next. Great for dynamic insertions.",
    tags: ["Dynamic", "Nodes", "O(n) access"],
  },
  {
    title: "Stack",
    description: "LIFO structure. Used in recursion, parsing, and undo functionality.",
    tags: ["LIFO", "Push/Pop", "O(1) ops"],
  },
  {
    title: "Queue",
    description: "FIFO structure. Used in scheduling, buffering, and BFS.",
    tags: ["FIFO", "Enqueue/Dequeue", "O(1) ops"],
  },
  {
    title: "Hash Table",
    description: "Maps keys to values for fast lookups using a hash function.",
    tags: ["Key-Value", "O(1) avg", "Hashing"],
  },
  {
    title: "Binary Tree",
    description: "Hierarchical structure with nodes having up to two children. Great for sorted data.",
    tags: ["Recursive", "O(log n)", "Search Tree"],
  },
];

const DataStructuresSection: React.FC = () => {
  return (
    <section className="section-outer">
      <h2 className="text-heading-2 text-4xl mb-8 text-center fade-in">Data Structures</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataStructures.map((ds) => (
          <Card
            key={ds.title}
            title={ds.title}
            description={ds.description}
            tags={ds.tags}
          />
        ))}
      </div>
    </section>
  );
};

export default DataStructuresSection;
