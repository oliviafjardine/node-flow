import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isHighlighted?: boolean;
  isDirected?: boolean;
  weight?: string | number;
  color?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  strokeWidth?: number;
  className?: string;
}

const AnimatedEdge: React.FC<AnimatedEdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  isHighlighted = false,
  isDirected = false,
  weight,
  color = 'default',
  strokeWidth = 2,
  className = ''
}) => {
  const colorClasses = {
    default: 'stroke-subtle',
    accent: 'stroke-accent',
    success: 'stroke-success',
    warning: 'stroke-warning',
    error: 'stroke-error'
  };

  const edgeColor = isHighlighted ? 'accent' : color;
  
  // Calculate arrow position for directed edges
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLength = 10;
  const arrowX = x2 - Math.cos(angle) * 20; // Offset from node edge
  const arrowY = y2 - Math.sin(angle) * 20;
  
  // Calculate midpoint for weight label
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g className={className}>
      {/* Main edge line */}
      <motion.line
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={colorClasses[edgeColor]}
        strokeWidth={isHighlighted ? strokeWidth + 1 : strokeWidth}
        strokeLinecap="round"
      />
      
      {/* Arrow for directed edges */}
      {isDirected && (
        <motion.polygon
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          points={`
            ${arrowX},${arrowY}
            ${arrowX - arrowLength * Math.cos(angle - Math.PI / 6)},${arrowY - arrowLength * Math.sin(angle - Math.PI / 6)}
            ${arrowX - arrowLength * Math.cos(angle + Math.PI / 6)},${arrowY - arrowLength * Math.sin(angle + Math.PI / 6)}
          `}
          className={`fill-current ${colorClasses[edgeColor].replace('stroke-', 'text-')}`}
        />
      )}
      
      {/* Weight label */}
      {weight && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <circle
            cx={midX}
            cy={midY}
            r="12"
            className="fill-surface stroke-subtle"
            strokeWidth="1"
          />
          <text
            x={midX}
            y={midY}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-semibold fill-primary"
          >
            {weight}
          </text>
        </motion.g>
      )}
    </g>
  );
};

export default AnimatedEdge;
