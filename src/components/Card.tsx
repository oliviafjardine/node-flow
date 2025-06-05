import React from "react";
import { Link } from "react-router-dom";

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
}

const Card: React.FC<CardProps> = ({ title, description, timeComplexity, link, tags = [] }) => {
  return (
    <Link
      to={link}
      className="bg-box p-6 rounded-xl shadow-md border border-[hsl(var(--box-border))] fade-in-left block hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full"
    >
      <h3 className="text-heading-1 text-xl font-semibold mb-4">{title}</h3>

      <p className="text-heading-3 mb-6">{description}</p>

      <div className="mb-4">
        <h4 className="text-heading-1 font-semibold mb-2">Time Complexity:</h4>
        <ul className="text-heading-3 text-sm list-disc list-inside space-y-1">
          {timeComplexity.access && (
            <li>
              <strong>Access:</strong> {timeComplexity.access}
            </li>
          )}
          {timeComplexity.search && (
            <li>
              <strong>Search:</strong> {timeComplexity.search}
            </li>
          )}
          {timeComplexity.insert && (
            <li>
              <strong>Insert:</strong> {timeComplexity.insert}
            </li>
          )}
          {timeComplexity.delete && (
            <li>
              <strong>Delete:</strong> {timeComplexity.delete}
            </li>
          )}
        </ul>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-heading-2 text-heading-4"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <span className="btn inline-block text-sm px-6 py-2 rounded-full">Explore {title}</span>
    </Link>
  );
};

export default Card;
