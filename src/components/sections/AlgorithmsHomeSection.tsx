import React from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";

const AlgorithmsHomeSection: React.FC = () => {
  return (
    <Link
      to="/algorithms"
      className="group block h-full bg-surface rounded-2xl border border-subtle hover:border-accent/30 p-10 transition-all duration-300 hover:shadow-custom-lg hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center h-full">
        <div className="w-24 h-24 bg-gradient-to-br from-accent-light to-accent/10 border border-accent/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-300">
          <Zap className="w-12 h-12 text-accent" />
        </div>

        <h3 className="text-3xl font-bold text-primary mb-6 group-hover:text-accent transition-colors">
          Algorithms
        </h3>

        <p className="text-secondary text-center mb-10 leading-relaxed flex-grow text-lg">
          Master sorting, searching, dynamic programming, graph algorithms, and other essential computational techniques with visual demonstrations.
        </p>

        <div className="flex items-center justify-center gap-3 text-accent font-semibold text-lg group-hover:gap-4 transition-all duration-300">
          <span>Start Learning</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default AlgorithmsHomeSection;
