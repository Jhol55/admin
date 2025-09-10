'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const borderClasses = border ? 'border border-gray-200 dark:border-gray-700' : '';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';

  const classes = `
    bg-white dark:bg-gray-900 rounded-lg
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${borderClasses}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};

// Stats Card component
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className = ''
}) => {
  const changeClasses = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={`text-xs ${changeClasses[change.type]}`}>
              {change.type === 'increase' && '+'}
              {change.value}
              {change.type === 'increase' && ' ↗'}
              {change.type === 'decrease' && ' ↘'}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// Feature Card component
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  href,
  className = ''
}) => {
  const content = (
    <Card hover className={className}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default Card;
