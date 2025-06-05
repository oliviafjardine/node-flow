import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  description: string;
  tags?: string[];
  link?: string; 
}

const Card: React.FC<CardProps> = ({ title, description, tags = [], link }) => {
  const content = (
    <div className="bg-box p-6 rounded-xl shadow-md border border-[hsl(var(--box-border))] hover:shadow-lg transition-shadow duration-200 fade-in-left cursor-pointer h-full">
      <h3 className="text-heading-1 text-xl font-semibold mb-2">{title}</h3>
      <p className="text-heading-3 text-sm mb-4">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs px-3 py-1 rounded-full bg-heading-2 text-heading-4">
              {tag}
            </span>
          ))}
        </div>
      )}
      <span className="text-sm underline text-heading-3">Explore →</span>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : <div>{content}</div>;
};

export default Card;
