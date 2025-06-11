import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedNodeProps {
  value: string | number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isComparing?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  className?: string;
}

const AnimatedNode: React.FC<AnimatedNodeProps> = ({
  value,
  x,
  y,
  isHighlighted = false,
  isSelected = false,
  isComparing = false,
  onClick,
  size = 'md',
  color = 'default',
  children,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const colorClasses = {
    default: 'bg-surface-elevated border-subtle text-primary',
    accent: 'bg-accent-light border-accent/30 text-accent',
    success: 'bg-success-light border-success/30 text-success',
    warning: 'bg-warning-light border-warning/30 text-warning',
    error: 'bg-error-light border-error/30 text-error'
  };

  const getNodeColor = () => {
    if (isSelected) return 'accent';
    if (isHighlighted) return 'warning';
    if (isComparing) return 'success';
    return color;
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x,
        y
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`
        absolute border-2 rounded-full flex items-center justify-center font-semibold
        cursor-pointer select-none transition-all duration-200
        ${sizeClasses[size]}
        ${colorClasses[getNodeColor()]}
        ${onClick ? 'hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        transform: `translate(${x}px, ${y}px)`
      }}
    >
      <span>{value}</span>
      {children}
    </motion.div>
  );
};

export default AnimatedNode;
