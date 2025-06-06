import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Database,
  Upload,
  Trash2,
  ArrowDownRight,
} from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  timeComplexity: {
    access?: string;
    search?: string;
    insert?: string;
    delete?: string;
  };
  link: string;
  tags?: string[];
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  timeComplexity,
  link,
  tags = [],
  icon,  // destructure icon
}) => {
  return (
    <Link
      to={link}
      className="group flex flex-col h-full rounded-2xl border border-[hsl(var(--box-border))] bg-box p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Top Content */}
      <div className="flex-grow">
        {/* Title with icon */}
        <div className="mb-3 flex items-center gap-3">
          {icon && <div className="w-6 h-6 text-heading-1">{icon}</div>}
          <h3 className="text-2xl font-bold text-heading-1">{title}</h3>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm font-semibold text-heading-3 leading-relaxed">{description}</p>

        {/* Time Complexity */}
        <div className="mb-6">
          <h4 className="mb-2 text-heading-2 font-semibold">Time Complexity</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-heading-3">
            {timeComplexity.access && (
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-heading-2" />
                <span>
                  <strong>Access:</strong> {timeComplexity.access}
                </span>
              </li>
            )}
            {timeComplexity.search && (
              <li className="flex items-center gap-2">
                <Search className="w-4 h-4 text-heading-2" />
                <span>
                  <strong>Search:</strong> {timeComplexity.search}
                </span>
              </li>
            )}
            {timeComplexity.insert && (
              <li className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-heading-2" />
                <span>
                  <strong>Insert:</strong> {timeComplexity.insert}
                </span>
              </li>
            )}
            {timeComplexity.delete && (
              <li className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-heading-2" />
                <span>
                  <strong>Delete:</strong> {timeComplexity.delete}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Row: Tags + Arrow */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-heading-2/10 text-heading-4 px-3 py-1 text-xs font-medium border border-heading-2"
            >
              {tag}
            </span>
          ))}
        </div>
        <ArrowDownRight className="w-5 h-5 text-heading-1 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </Link>
  );
};

export default Card;
