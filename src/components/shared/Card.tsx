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
      className="group block h-full bg-surface rounded-xl border border-subtle hover:border-accent/30 transition-all duration-300 hover:shadow-custom-lg hover:-translate-y-1"
    >
      <div className="p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {icon && (
            <div className="w-14 h-14 bg-accent-light border border-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent-muted group-hover:border-accent/30 transition-all duration-300">
              <div className="w-7 h-7 text-accent transition-colors">
                {icon}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary leading-relaxed mb-8 flex-grow">
          {description}
        </p>

        {/* Time Complexity Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-accent-light rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <span className="font-semibold text-primary">Time Complexity</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {timeComplexity.access && (
              <div className="flex items-center gap-3 p-4 bg-surface-elevated border border-subtle rounded-lg hover:border-accent/20 transition-colors">
                <Database className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-muted font-medium">Access</div>
                  <div className="font-mono font-semibold text-primary">{timeComplexity.access}</div>
                </div>
              </div>
            )}
            {timeComplexity.search && (
              <div className="flex items-center gap-3 p-4 bg-surface-elevated border border-subtle rounded-lg hover:border-accent/20 transition-colors">
                <Search className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-muted font-medium">Search</div>
                  <div className="font-mono font-semibold text-primary">{timeComplexity.search}</div>
                </div>
              </div>
            )}
            {timeComplexity.insert && (
              <div className="flex items-center gap-3 p-4 bg-surface-elevated border border-subtle rounded-lg hover:border-accent/20 transition-colors">
                <Upload className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-muted font-medium">Insert</div>
                  <div className="font-mono font-semibold text-primary">{timeComplexity.insert}</div>
                </div>
              </div>
            )}
            {timeComplexity.delete && (
              <div className="flex items-center gap-3 p-4 bg-surface-elevated border border-subtle rounded-lg hover:border-accent/20 transition-colors">
                <Trash2 className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-muted font-medium">Delete</div>
                  <div className="font-mono font-semibold text-primary">{timeComplexity.delete}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-accent-light border border-accent/20 text-accent text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-1 bg-surface-elevated border border-subtle text-muted text-xs font-medium rounded-full">
                +{tags.length - 2}
              </span>
            )}
          </div>

          <div className="w-8 h-8 bg-surface-elevated border border-subtle rounded flex items-center justify-center group-hover:bg-accent-light group-hover:border-accent/20 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
