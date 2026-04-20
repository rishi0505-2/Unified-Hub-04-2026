import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  className,
  hover = false,
  onClick,
  padding = 'md',
}: CardProps) {
  const Component = hover || onClick ? motion.div : 'div';
  const motionProps =
    hover || onClick
      ? {
          whileHover: { y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
          transition: { duration: 0.2 },
        }
      : {};

  return (
    <Component
      {...motionProps}
      onClick={onClick}
      className={cn(
        'card',
        paddingClasses[padding],
        onClick && 'cursor-pointer',
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </Component>
  );
}
