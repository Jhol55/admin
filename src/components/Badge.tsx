'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

interface NotificationBadgeProps {
  count: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center font-medium";
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-indigo-100 text-indigo-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700"
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  const roundedClasses = rounded ? "rounded-full" : "rounded-md";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const statusConfig = {
    active: {
      label: 'Ativo',
      classes: 'bg-green-100 text-green-700',
      dotClasses: 'bg-green-400'
    },
    inactive: {
      label: 'Inativo',
      classes: 'bg-gray-100 text-gray-800',
      dotClasses: 'bg-gray-400'
    },
    pending: {
      label: 'Pendente',
      classes: 'bg-yellow-100 text-yellow-700',
      dotClasses: 'bg-yellow-400'
    },
    completed: {
      label: 'Concluído',
      classes: 'bg-green-100 text-green-700',
      dotClasses: 'bg-green-400'
    },
    failed: {
      label: 'Falhou',
      classes: 'bg-red-100 text-red-700',
      dotClasses: 'bg-red-400'
    },
    warning: {
      label: 'Aviso',
      classes: 'bg-orange-100 text-orange-700',
      dotClasses: 'bg-orange-400'
    }
  };

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs gap-0.5",
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2"
  };

  const dotSizeClasses = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5"
  };

  const config = statusConfig[status];
  const classes = `inline-flex items-center font-medium rounded-full ${config.classes} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {showDot && (
        <span className={`${config.dotClasses} ${dotSizeClasses[size]} rounded-full`} />
      )}
      {config.label}
    </span>
  );
};

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  size = 'md',
  className = ''
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  const sizeClasses = {
    sm: "min-w-[1.25rem] h-5 px-1 text-xs",
    md: "min-w-[1.5rem] h-6 px-1.5 text-sm",
    lg: "min-w-[2rem] h-8 px-2 text-base"
  };

  const classes = `inline-flex items-center justify-center font-medium bg-red-500 text-white rounded-full ${sizeClasses[size]} ${className}`;

  if (count === 0) return null;

  return (
    <span className={classes}>
      {displayCount}
    </span>
  );
};

// Icon Badge component
interface IconBadgeProps {
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center";
  
  const variantClassesIcon = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-indigo-100 text-indigo-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-cyan-100 text-cyan-600"
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const roundedClasses = rounded ? "rounded-full" : "rounded-md";

  const classes = `${baseClasses} ${variantClassesIcon[variant]} ${sizeClasses[size]} ${roundedClasses} ${className}`;

  return (
    <span className={classes}>
      {icon}
    </span>
  );
};

// Progress Badge component
interface ProgressBadgeProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({
  progress,
  size = 'md',
  showPercentage = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: "w-16 h-2",
    md: "w-20 h-3",
    lg: "w-24 h-4"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getProgressColor(progress)} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <span className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default Badge;
