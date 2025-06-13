import { Link } from "react-router-dom";
import {
  Search,
  Database,
  Upload,
  Trash2,
  ArrowRight,
  Clock,
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
  icon,
}) => {
  return (
    <Link
      to={link}
      className="block h-full bg-surface-elevated rounded border border-subtle"
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-10 h-10 bg-accent-light border border-accent/20 rounded flex items-center justify-center">
              <div className="w-5 h-5 text-accent">
                {icon}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        {/* Time Complexity */}
        <div className="mb-4">
          <div className="text-sm font-medium text-primary mb-2">Time Complexity</div>
          <div className="space-y-1 text-sm">
            {timeComplexity.access && (
              <div className="flex justify-between">
                <span className="text-muted">Access:</span>
                <span className="font-mono text-primary">{timeComplexity.access}</span>
              </div>
            )}
            {timeComplexity.search && (
              <div className="flex justify-between">
                <span className="text-muted">Search:</span>
                <span className="font-mono text-primary">{timeComplexity.search}</span>
              </div>
            )}
            {timeComplexity.insert && (
              <div className="flex justify-between">
                <span className="text-muted">Insert:</span>
                <span className="font-mono text-primary">{timeComplexity.insert}</span>
              </div>
            )}
            {timeComplexity.delete && (
              <div className="flex justify-between">
                <span className="text-muted">Delete:</span>
                <span className="font-mono text-primary">{timeComplexity.delete}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-accent-light text-accent text-xs rounded border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="mt-auto pt-4 border-t border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-secondary text-sm">View Details</span>
            <ArrowRight className="w-4 h-4 text-muted" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
