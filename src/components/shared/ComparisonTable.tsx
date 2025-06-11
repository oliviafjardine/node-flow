import React from "react";
import { Database, Search, Upload, Trash2 } from "lucide-react";

interface ComparisonItem {
  title: string;
  description: string;
  timeComplexity: {
    access?: string;
    search?: string;
    insert?: string;
    delete?: string;
  };
  tags?: string[];
}

interface ComparisonTableProps {
  items: ComparisonItem[];
  title: string;
  summaryInfo?: {
    title: string;
    items: string[];
  }[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ items, title, summaryInfo }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">{title} Comparison</h3>
        <p className="text-secondary">Compare time complexities and characteristics at a glance</p>
      </div>

      {/* Complexity Legend */}
      <div className="bg-surface-elevated rounded-lg p-4 border border-subtle">
        <h4 className="text-sm font-semibold text-primary mb-3">Complexity Legend</h4>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded complexity-excellent border"></div>
            <span className="text-secondary">O(1) - Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded complexity-good border"></div>
            <span className="text-secondary">O(log n) - Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded complexity-fair border"></div>
            <span className="text-secondary">O(n) - Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded complexity-acceptable border"></div>
            <span className="text-secondary">O(n log n) - Acceptable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded complexity-poor border"></div>
            <span className="text-secondary">O(n²)+ - Poor</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-default overflow-hidden shadow-custom-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-surface-elevated border-b border-subtle">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Description</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    <Database className="w-4 h-4" />
                    Access
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Insert
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {items.map((item, index) => (
                <tr key={item.title} className={index % 2 === 0 ? "bg-surface" : "bg-surface-elevated"}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary">{item.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary max-w-xs leading-relaxed">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-medium border ${
                      getComplexityColor(item.timeComplexity.access)
                    }`}>
                      {item.timeComplexity.access || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-medium border ${
                      getComplexityColor(item.timeComplexity.search)
                    }`}>
                      {item.timeComplexity.search || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-medium border ${
                      getComplexityColor(item.timeComplexity.insert)
                    }`}>
                      {item.timeComplexity.insert || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-mono font-medium border ${
                      getComplexityColor(item.timeComplexity.delete)
                    }`}>
                      {item.timeComplexity.delete || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-brand-light text-brand"
                        >
                          {tag}
                        </span>
                      ))}
                      {(item.tags?.length || 0) > 2 && (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-surface-elevated text-tertiary">
                          +{(item.tags?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Information */}
      {summaryInfo && (
        <div className="bg-surface-elevated rounded-xl p-6 border border-subtle">
          <h4 className="text-lg font-semibold text-primary mb-4">Quick Reference</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {summaryInfo.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="font-medium text-primary">{section.title}:</div>
                <div className="text-sm text-secondary leading-relaxed">
                  {section.items.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on complexity
const getComplexityColor = (complexity?: string): string => {
  if (!complexity || complexity === "N/A") {
    return "bg-gray-50 text-gray-600 border-gray-200";
  }

  if (complexity.includes("O(1)")) {
    return "complexity-excellent";
  } else if (complexity.includes("O(log n)")) {
    return "complexity-good";
  } else if (complexity.includes("O(n)") && !complexity.includes("O(n log n)") && !complexity.includes("O(n^2)")) {
    return "complexity-fair";
  } else if (complexity.includes("O(n log n)")) {
    return "complexity-acceptable";
  } else {
    return "complexity-poor";
  }
};

export default ComparisonTable;
